import api from './axiosConfig';

export const authService = {
    register: async (data) => {
    const response = await api.post('/auth/register', data);
    const userObj = response.data;
    if (userObj?.token) {
      localStorage.setItem('token', userObj.token);
      localStorage.setItem('user', JSON.stringify(userObj));
    }
    return userObj;
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const userObj = response.data;
    if (userObj?.token) {
      localStorage.setItem('token', userObj.token);
      localStorage.setItem('user', JSON.stringify(userObj));
    }
    return userObj;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user?.role === 'ADMIN';
  }
};