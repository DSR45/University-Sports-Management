import api from './axiosConfig';

export const playerService = {
  // Player endpoints
  getMyProfile: () => api.get('/players/me'),
  
  updateMyProfile: (data) => api.put('/players/me', data),
  
  getMyEvaluation: () => api.get('/players/me/evaluation'),
  
  // Admin endpoints
  getAllPlayers: (params) => api.get('/admin/players', { params }),
  
  getPlayerById: (id) => api.get(`/admin/players/${id}`),
  
  updatePlayer: (id, data) => api.put(`/admin/players/${id}`, data),
  
  updatePlayerStatus: (id, status) => 
    api.patch(`/admin/players/${id}/status`, { status }),
  
  deletePlayer: (id) => api.delete(`/admin/players/${id}`)
};