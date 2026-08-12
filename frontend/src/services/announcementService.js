import api from './axiosConfig';

export const announcementService = {
  getAnnouncements: (params) => api.get('/announcements', { params }),
  
  createAnnouncement: (data) => api.post('/admin/announcements', data),
  
  updateAnnouncement: (id, data) => api.put(`/admin/announcements/${id}`, data),
  
  deleteAnnouncement: (id) => api.delete(`/admin/announcements/${id}`)
};