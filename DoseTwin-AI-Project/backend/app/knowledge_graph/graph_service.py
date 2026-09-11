import json
import os
from pathlib import Path
from typing import Dict, Any, List, Optional
from neo4j import GraphDatabase
from app.config import settings
from app.schemas.dto import ObservationData, MedicationItem

class KnowledgeGraphService:
    def __init__(self):
        # We handle connection at run-time so we don't crash if neo4j is down
        self.uri = os.environ.get("NEO4J_URI", "bolt://localhost:7687")
        self.user = os.environ.get("NEO4J_USER", "neo4j")
        self.password = os.environ.get("NEO4J_PASSWORD", "dosetwin_neo4j")
        self.driver = None

    def _get_driver(self):
        if not self.driver:
            try:
                self.driver = GraphDatabase.driver(self.uri, auth=(self.user, self.password))
                self.driver.verify_connectivity()
            except Exception as e:
                print(f"Failed to connect to Neo4j: {e}")
                self.driver = None
        return self.driver

    def initialize_base_knowledge(self):
        """Loads default synthetic interactions and medication metadata into Neo4j."""
        driver = self._get_driver()
        if not driver:
            return

        with driver.session() as session:
            # Clear existing for idempotent initialization
            session.run("MATCH (n) DETACH DELETE n")

            # 1. Load drug indications
            meds_path = Path(settings.MEDICATIONS_DATA_PATH)
            if meds_path.exists():
                try:
                    with open(meds_path, "r") as f:
                        medications = json.load(f)
                    
                    for med in medications:
                        session.run(
                            """
                            MERGE (d:Drug {id: $drug_name})
                            SET d.label = $drug_name,
                                d.therapeutic_class = $t_class,
                                d.standard_dosage = $dosage,
                                d.route = $route
                            """,
                            drug_name=med["drug_name"],
                            t_class=med.get("therapeutic_class", "General"),
                            dosage=med.get("standard_dosage", "Standard"),
                            route=med.get("route", "Oral")
                        )
                        for ind in med.get("indications", []):
                            session.run(
                                """
                                MERGE (c:Condition {id: $cond_name})
                                SET c.label = $cond_name
                                WITH c
                                MATCH (d:Drug {id: $drug_name})
                                MERGE (d)-[:USED_FOR]->(c)
                                """,
                                cond_name=ind,
                                drug_name=med["drug_name"]
                            )
                except Exception as e:
                    print(f"Warning loading synthetic medications into Neo4j: {e}")

            # 2. Load interaction rules
            inter_path = Path(settings.INTERACTIONS_DATA_PATH)
            if inter_path.exists():
                try:
                    with open(inter_path, "r") as f:
                        interactions = json.load(f)
                    for rule in interactions:
                        session.run(
                            """
                            MERGE (d1:Drug {id: $drug_a})
                            ON CREATE SET d1.label = $drug_a
                            MERGE (d2:Drug {id: $drug_b})
                            ON CREATE SET d2.label = $drug_b
                            WITH d1, d2
                            MERGE (d1)-[r1:INTERACTS_WITH]->(d2)
                            SET r1.severity = $severity,
                                r1.mechanism = $mechanism,
                                r1.description = $description,
                                r1.recommendation = $recommendation
                            MERGE (d2)-[r2:INTERACTS_WITH]->(d1)
                            SET r2.severity = $severity,
                                r2.mechanism = $mechanism,
                                r2.description = $description,
                                r2.recommendation = $recommendation
                            """,
                            drug_a=rule["drug_a"],
                            drug_b=rule["drug_b"],
                            severity=rule["severity"],
                            mechanism=rule.get("mechanism", ""),
                            description=rule["description"],
                            recommendation=rule["recommendation"]
                        )
                except Exception as e:
                    print(f"Warning loading interaction rules into Neo4j: {e}")

    def build_patient_twin_subgraph(
        self,
        patient_code: str,
        name: str,
        condition: str,
        observations: ObservationData,
        medications: List[MedicationItem]
    ) -> Dict[str, Any]:
        """Constructs and returns an enriched digital twin knowledge subgraph for a patient using Neo4j."""
        driver = self._get_driver()
        if not driver:
            return {"graph": {"nodes": [], "edges": [], "total_nodes": 0, "total_edges": 0}, "detected_graph_conflicts": [], "connected_entities_count": 0}

        nodes = []
        edges = []
        seen_edges = set()
        detected_conflicts = []

        with driver.session() as session:
            # Temporary setup of patient subgraph in Neo4j just for traversal
            # First, clean any old temporary twin data for this patient code
            pat_id = f"Patient:{patient_code}"
            
            # Since this is a stateless read call ideally, we just query and build the JSON response
            # We don't necessarily have to persist the patient in the global graph, but for demo we can
            session.run(
                """
                MERGE (p:Patient {id: $pat_id})
                SET p.label = $label, p.code = $code, p.name = $name
                MERGE (c:Condition {id: $cond_name})
                ON CREATE SET c.label = $cond_name
                MERGE (p)-[:HAS_CONDITION]->(c)
                """,
                pat_id=pat_id,
                label=f"{name} ({patient_code})",
                code=patient_code,
                name=name,
                cond_name=condition
            )

            # Observations
            obs_map = [
                ("Blood Pressure", f"{int(observations.systolic_bp)}/{int(observations.diastolic_bp)} mmHg"),
                ("Heart Rate", f"{int(observations.heart_rate)} bpm"),
                ("Blood Glucose", f"{int(observations.blood_glucose)} mg/dL"),
                ("Creatinine", f"{observations.creatinine} mg/dL"),
                ("ALT Liver", f"{observations.alt_liver} U/L")
            ]
            for obs_name, obs_val in obs_map:
                obs_id = f"Observation:{obs_name}:{patient_code}"
                session.run(
                    """
                    MATCH (p:Patient {id: $pat_id})
                    MERGE (o:Observation {id: $obs_id})
                    SET o.label = $label, o.metric = $metric, o.value = $val
                    MERGE (p)-[:HAS_OBSERVATION]->(o)
                    """,
                    pat_id=pat_id, obs_id=obs_id, label=f"{obs_name}: {obs_val}", metric=obs_name, val=obs_val
                )

            # Medications
            active_drugs = []
            for med in medications:
                active_drugs.append(med.drug_name)
                session.run(
                    """
                    MATCH (p:Patient {id: $pat_id})
                    MERGE (d:Drug {id: $drug_name})
                    ON CREATE SET d.label = $drug_name
                    MERGE (p)-[r:TAKES]->(d)
                    SET r.dosage = $dosage, r.frequency = $freq, r.route = $route
                    """,
                    pat_id=pat_id, drug_name=med.drug_name, dosage=med.dosage, freq=med.frequency, route=med.route
                )

            # Fetch subgraph to return to UI
            # 1. Get Patient and direct neighbors
            result = session.run(
                """
                MATCH (p:Patient {id: $pat_id})-[r]->(n)
                RETURN p, r, n
                """,
                pat_id=pat_id
            )
            
            node_map = {}
            for record in result:
                p_node = record["p"]
                r_edge = record["r"]
                n_node = record["n"]
                
                if p_node["id"] not in node_map:
                    node_map[p_node["id"]] = {"id": p_node["id"], "label": p_node["label"], "type": "Patient", "properties": dict(p_node)}
                if n_node["id"] not in node_map:
                    node_map[n_node["id"]] = {"id": n_node["id"], "label": n_node["label"], "type": list(n_node.labels)[0], "properties": dict(n_node)}
                
                edge_sig = f"{p_node['id']}->{n_node['id']}:{r_edge.type}"
                if edge_sig not in seen_edges:
                    seen_edges.add(edge_sig)
                    edges.append({
                        "source": p_node["id"],
                        "target": n_node["id"],
                        "relationship": r_edge.type,
                        "properties": dict(r_edge)
                    })

            # 2. Get USED_FOR and INTERACTS_WITH for the active drugs
            if active_drugs:
                res2 = session.run(
                    """
                    MATCH (d1:Drug)-[r]->(n)
                    WHERE d1.id IN $drugs AND (type(r) = 'USED_FOR' OR (type(r) = 'INTERACTS_WITH' AND n.id IN $drugs))
                    RETURN d1, r, n
                    """,
                    drugs=active_drugs
                )
                for record in res2:
                    d1 = record["d1"]
                    r = record["r"]
                    n = record["n"]

                    if d1["id"] not in node_map:
                        node_map[d1["id"]] = {"id": d1["id"], "label": d1["label"], "type": "Drug", "properties": dict(d1)}
                    if n["id"] not in node_map:
                        node_map[n["id"]] = {"id": n["id"], "label": n["label"], "type": list(n.labels)[0], "properties": dict(n)}

                    edge_sig = f"{d1['id']}->{n['id']}:{r.type}"
                    if edge_sig not in seen_edges:
                        seen_edges.add(edge_sig)
                        edges.append({
                            "source": d1["id"],
                            "target": n["id"],
                            "relationship": r.type,
                            "properties": dict(r)
                        })

                        if r.type == 'INTERACTS_WITH':
                            # To avoid duplicate conflict entries, only add if A < B
                            if d1["id"] < n["id"]:
                                detected_conflicts.append({
                                    "drug_a": d1["label"],
                                    "drug_b": n["label"],
                                    "severity": dict(r).get("severity", "Moderate"),
                                    "description": dict(r).get("description", "")
                                })

            nodes = list(node_map.values())

        return {
            "graph": {
                "nodes": nodes,
                "edges": edges,
                "total_nodes": len(nodes),
                "total_edges": len(edges)
            },
            "detected_graph_conflicts": detected_conflicts,
            "connected_entities_count": len(nodes)
        }

kg_service = KnowledgeGraphService()
