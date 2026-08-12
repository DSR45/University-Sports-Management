import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';
import { handleApiError } from '../utils/errorHandler';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Error loading user:', error);
      // Clear corrupted data
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      setUser(data);
      toast.success(`Welcome back, ${data.name}!`);
      return data;
    } catch (error) {
      const errorInfo = handleApiError(error, 'Login failed');
      throw errorInfo;
    }
  };

  const register = async (userData) => {
    try {
      const data = await authService.register(userData);
      setUser(data);
      toast.success('Registration successful! Welcome to MUJ Volleyball.');
      return data;
    } catch (error) {
      const errorInfo = handleApiError(error, 'Registration failed');
      throw errorInfo;
    }
  };

  const logout = () => {
    try {
      authService.logout();
      setUser(null);
      toast.info('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if error occurs
      localStorage.clear();
      setUser(null);
      window.location.href = '/login';
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};