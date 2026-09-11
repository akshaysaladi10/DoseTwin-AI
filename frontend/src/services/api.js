import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

export const apiService = {
  // System
  checkHealth: () => apiClient.get('/health'),

  // Patients
  getPatients: () => apiClient.get('/api/v1/patients'),
  getPatient: (id) => apiClient.get(`/api/v1/patients/${id}`),
  createPatient: (data) => apiClient.post('/api/v1/patients', data),
  updatePatientObservations: (id, data) => apiClient.put(`/api/v1/patients/${id}/observations`, data),

  // Medications
  getMedicationCatalog: () => apiClient.get('/api/v1/medications'),
  addMedication: (data) => apiClient.post('/api/v1/medications', data),

  // Drug Interactions
  checkInteractions: (drugs) => apiClient.post('/api/v1/interactions/check', { drugs }),
  getInteractionRules: () => apiClient.get('/api/v1/interactions/rules'),

  // ML Prediction
  predictDrugResponse: (payload) => apiClient.post('/api/v1/prediction/predict', payload),

  // FHIR
  getPatientFHIR: (patientId) => apiClient.get(`/api/v1/fhir/Patient/${patientId}`),
  getBundleFHIR: (patientId) => apiClient.get(`/api/v1/fhir/Bundle/${patientId}`),

  // Knowledge Graph
  getGlobalKnowledgeGraph: () => apiClient.get('/api/v1/knowledge-graph/interactions'),
  getPatientKnowledgeGraph: (patientId) => apiClient.get(`/api/v1/knowledge-graph/patient/${patientId}`),

  // Orchestrated Simulation
  analyzeDigitalTwin: (payload) => apiClient.post('/api/v1/analyze', payload),
};

export default apiClient;
