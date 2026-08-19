import api from './axiosConfig';

const normalizeAnnouncementPayload = (data) => {
  const content = data.content ?? data.message ?? '';

  return {
    title: data.title,
    content,
    // Backward compatibility for older backend versions that still expect `message`.
    message: content
  };
};

export const announcementService = {
  getAnnouncements: (params) => api.get('/announcements', { params }),
  
  createAnnouncement: (data) => api.post('/admin/announcements', normalizeAnnouncementPayload(data)),
  
  updateAnnouncement: (id, data) => api.put(`/admin/announcements/${id}`, normalizeAnnouncementPayload(data)),
  
  deleteAnnouncement: (id) => api.delete(`/admin/announcements/${id}`)
};