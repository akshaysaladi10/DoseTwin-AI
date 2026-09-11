import json
from pathlib import Path
from typing import List, Dict, Any, Tuple
from sqlalchemy.orm import Session

from app.models.entities import InteractionRuleModel
from app.schemas.dto import InteractionResult, InteractionCheckResponse
from app.config import settings

class InteractionService:
    def __init__(self):
        self._rules_cache: List[Dict[str, Any]] = []
        self._load_local_rules()

    def _load_local_rules(self):
        """Loads interaction rules from synthetic JSON file into in-memory cache."""
        path = Path(settings.INTERACTIONS_DATA_PATH)
        if path.exists():
            try:
                with open(path, "r") as f:
                    self._rules_cache = json.load(f)
            except Exception as e:
                print(f"Error loading interaction data JSON: {e}")

    def normalize_drug_name(self, name: str) -> str:
        """Normalizes drug name for order-independent lookup."""
        clean = name.strip().lower()
        # Remove common brand/dose noise if passed
        for noise in ["tablet", "capsule", "mg", "mcg", "oral"]:
            clean = clean.replace(noise, "")
        return clean.strip()

    def check_drug_interactions(self, drugs: List[str]) -> InteractionCheckResponse:
        """
        Evaluates all combinations of active drugs for interactions.
        Order-independent: (Drug A, Drug B) matches (Drug B, Drug A).
        """
        if not self._rules_cache:
            self._load_local_rules()

        # Clean and deduplicate drugs
        cleaned_drugs = []
        seen = set()
        for d in drugs:
            norm = self.normalize_drug_name(d)
            if norm and norm not in seen:
                seen.add(norm)
                cleaned_drugs.append(d.strip())

        detected_conflicts: List[InteractionResult] = []
        severity_rank = {"None": 0, "Low": 1, "Moderate": 2, "High": 3}
        highest_severity = "None"

        # Check all unique pairs
        n = len(cleaned_drugs)
        for i in range(n):
            for j in range(i + 1, n):
                drug_1 = cleaned_drugs[i]
                drug_2 = cleaned_drugs[j]
                norm_1 = self.normalize_drug_name(drug_1)
                norm_2 = self.normalize_drug_name(drug_2)

                # Find match in rules
                match = self._find_rule_match(norm_1, norm_2)
                if match:
                    sev = match.get("severity", "Moderate")
                    if severity_rank.get(sev, 0) > severity_rank.get(highest_severity, 0):
                        highest_severity = sev

                    detected_conflicts.append(InteractionResult(
                        drug_pair=[drug_1, drug_2],
                        severity=sev,
                        mechanism=match.get("mechanism", "Pharmacological interaction between active compounds."),
                        description=match.get("description", "Potential adverse interaction detected."),
                        recommendation=match.get("recommendation", "Review concurrent therapy with a physician.")
                    ))

        return InteractionCheckResponse(
            interaction_detected=len(detected_conflicts) > 0,
            total_conflicts=len(detected_conflicts),
            highest_severity=highest_severity,
            conflicts=detected_conflicts,
            disclaimer="Educational synthetic interaction rules only. Not a substitute for professional clinical pharmacotherapy evaluation."
        )

    def _find_rule_match(self, norm_1: str, norm_2: str) -> Dict[str, Any] | None:
        """Finds matching rule regardless of parameter order."""
        for rule in self._rules_cache:
            r_a = self.normalize_drug_name(rule["drug_a"])
            r_b = self.normalize_drug_name(rule["drug_b"])

            if (norm_1 == r_a and norm_2 == r_b) or (norm_1 == r_b and norm_2 == r_a):
                return rule
            # Also support substring matching for generic names
            if (norm_1 in r_a or r_a in norm_1) and (norm_2 in r_b or r_b in norm_2):
                return rule
        return None

    def get_all_rules(self) -> List[Dict[str, Any]]:
        """Returns all configured synthetic interaction rules."""
        if not self._rules_cache:
            self._load_local_rules()
        return self._rules_cache

    def seed_interaction_rules(self, db: Session):
        """Populates interaction_rules table from JSON file."""
        count = db.query(InteractionRuleModel).count()
        if count > 0:
            return
        
        rules = self.get_all_rules()
        for r in rules:
            row = InteractionRuleModel(
                drug_a=r["drug_a"],
                drug_b=r["drug_b"],
                severity=r["severity"],
                mechanism=r.get("mechanism", ""),
                description=r["description"],
                recommendation=r["recommendation"]
            )
            db.add(row)
        try:
            db.commit()
            print(f"Seeded {len(rules)} interaction rules into database.")
        except Exception as e:
            db.rollback()
            print(f"Error seeding interaction rules: {e}")

interaction_service = InteractionService()
