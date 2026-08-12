import api from './axiosConfig';

export const adminService = {
  getDashboardStats: () => api.get('/admin/dashboard')
};