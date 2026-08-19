import api from './axiosConfig';

export const publicService = {
  getPlayers: async () => {
    const response = await api.get('/public/team');
    return response.data;
  },

  getMatches: async () => {
    const response = await api.get('/public/matches');
    return response.data;
  },

  getLatestResult: async () => {
    const response = await api.get('/public/matches/latest-result');
    return response.data;
  },

  getNews: async () => {
    const response = await api.get('/public/news');
    return response.data;
  },

  getNewsBySlug: async (slug) => {
    const response = await api.get(`/public/news/${slug}`);
    return response.data;
  },

  getAchievements: async () => {
    const response = await api.get('/public/achievements');
    return response.data;
  },

  getEvents: async () => {
    const response = await api.get('/public/events');
    return response.data;
  },

  getGallery: async () => {
    const response = await api.get('/public/gallery');
    return response.data;
  },

  getVideos: async () => {
    const response = await api.get('/public/videos');
    return response.data;
  },

  getTeamInfo: async () => {
    const response = await api.get('/public/team-info');
    return response.data;
  }
};