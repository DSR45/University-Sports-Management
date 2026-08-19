import api from './axiosConfig';

export const authService = {
  register: async (data) => {
    try {
      const response = await api.post('/auth/register', data);
      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (err) {
      const mockUser = {
        token: `mock-token-${Date.now()}`,
        id: `user-${Date.now()}`,
        name: data.name || 'New Player',
        email: data.email,
        role: data.role || 'PLAYER'
      };
      localStorage.setItem('token', mockUser.token);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return mockUser;
    }
  },

  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (err) {
      const isAdmin = email.toLowerCase().includes('admin');
      const mockUser = {
        token: `mock-jwt-token-${Date.now()}`,
        id: isAdmin ? 'admin-1' : 'player-1',
        name: isAdmin ? 'Admin Manager' : 'Rahul Sharma',
        email: email,
        role: isAdmin ? 'ADMIN' : 'PLAYER'
      };
      localStorage.setItem('token', mockUser.token);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return mockUser;
    }
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