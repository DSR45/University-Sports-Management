import api from './axiosConfig';

export const evaluationService = {
  createEvaluation: (playerId, data) => 
    api.post(`/admin/players/${playerId}/evaluation`, data),
  
  getEvaluation: (playerId) => 
    api.get(`/admin/players/${playerId}/evaluation`),
  
  updateEvaluation: (playerId, data) => 
    api.put(`/admin/players/${playerId}/evaluation`, data)
};