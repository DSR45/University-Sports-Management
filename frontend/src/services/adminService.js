import api from './axiosConfig';
import { mockNews } from '../data/mock/news';
import { mockEvents } from '../data/mock/events';
import { mockMatches } from '../data/mock/matches';
import { mockAchievements } from '../data/mock/achievements';
import { mockGallery } from '../data/mock/gallery';
import { mockVideos } from '../data/mock/videos';
import { mockPlayers } from '../data/mock/players';
import { mockTeamInfo } from '../data/mock/team';

const safeCall = async (apiFunc, fallbackDataKey, defaultData) => {
  try {
    return await apiFunc();
  } catch (err) {
    const stored = localStorage.getItem(fallbackDataKey);
    if (stored) {
      return { data: JSON.parse(stored) };
    }
    if (defaultData) {
      localStorage.setItem(fallbackDataKey, JSON.stringify(defaultData));
      return { data: defaultData };
    }
    return { data: [] };
  }
};

export const adminService = {
  // Dashboard
  getDashboardStats: async () => {
    try {
      return await api.get('/admin/dashboard');
    } catch (err) {
      return {
        data: {
          totalPlayers: 18,
          pending: 3,
          shortlisted: 4,
          selected: 9,
          rejected: 2,
          evaluated: 12
        }
      };
    }
  },

  // News Management
  getNews: () => safeCall(() => api.get('/admin/news'), 'muj_admin_news', mockNews),
  createNews: (data) => api.post('/admin/news', data).catch(() => ({ data })),
  updateNews: (id, data) => api.put(`/admin/news/${id}`, data).catch(() => ({ data })),
  deleteNews: (id) => api.delete(`/admin/news/${id}`).catch(() => ({ data: { id } })),

  // Events Management
  getEvents: () => safeCall(() => api.get('/admin/events'), 'muj_admin_events', mockEvents),
  createEvent: (data) => api.post('/admin/events', data).catch(() => ({ data })),
  updateEvent: (id, data) => api.put(`/admin/events/${id}`, data).catch(() => ({ data })),
  deleteEvent: (id) => api.delete(`/admin/events/${id}`).catch(() => ({ data: { id } })),

  // Matches Management
  getMatches: () => safeCall(() => api.get('/admin/matches'), 'muj_admin_matches', mockMatches),
  createMatch: (data) => api.post('/admin/matches', data).catch(() => ({ data })),
  updateMatch: (id, data) => api.put(`/admin/matches/${id}`, data).catch(() => ({ data })),
  deleteMatch: (id) => api.delete(`/admin/matches/${id}`).catch(() => ({ data: { id } })),

  // Achievements Management
  getAchievements: () => safeCall(() => api.get('/admin/achievements'), 'muj_admin_achievements', mockAchievements),
  createAchievement: (data) => api.post('/admin/achievements', data).catch(() => ({ data })),
  updateAchievement: (id, data) => api.put(`/admin/achievements/${id}`, data).catch(() => ({ data })),
  deleteAchievement: (id) => api.delete(`/admin/achievements/${id}`).catch(() => ({ data: { id } })),

  // Gallery Management
  getGallery: () => safeCall(() => api.get('/admin/gallery'), 'muj_admin_gallery', mockGallery),
  createGalleryItem: (data) => api.post('/admin/gallery', data).catch(() => ({ data })),
  deleteGalleryItem: (id) => api.delete(`/admin/gallery/${id}`).catch(() => ({ data: { id } })),

  // Video Highlights Management
  getVideos: () => safeCall(() => api.get('/admin/videos'), 'muj_admin_videos', mockVideos),
  createVideo: (data) => api.post('/admin/videos', data).catch(() => ({ data })),
  updateVideo: (id, data) => api.put(`/admin/videos/${id}`, data).catch(() => ({ data })),
  deleteVideo: (id) => api.delete(`/admin/videos/${id}`).catch(() => ({ data: { id } })),

  // Team Info Management
  getTeamInfo: () => safeCall(() => api.get('/admin/team-info'), 'muj_admin_team_info', mockTeamInfo),
  updateTeamInfo: (data) => api.put('/admin/team-info', data).catch(() => ({ data })),

  // Announcements Management
  getAnnouncements: () => safeCall(() => api.get('/admin/announcements'), 'muj_admin_announcements', [
    {
      id: 'ann-1',
      title: 'Squad Selection for Inter-University Tournament',
      content: 'Final trials for the upcoming West Zone Inter-University Volleyball Tournament will be held this Saturday.',
      category: 'Trials',
      priority: 'HIGH',
      createdAt: '2025-02-14T10:00:00Z',
      targetRole: 'ALL'
    }
  ]),
  createAnnouncement: (data) => api.post('/admin/announcements', data).catch(() => ({ data })),
  updateAnnouncement: (id, data) => api.put(`/admin/announcements/${id}`, data).catch(() => ({ data })),
  deleteAnnouncement: (id) => api.delete(`/admin/announcements/${id}`).catch(() => ({ data: { id } })),

  // Player & Roster Management
  getPlayers: (params) => safeCall(() => api.get('/admin/players', { params }), 'muj_admin_players', mockPlayers),
  getPlayerById: async (id) => {
    try {
      return await api.get(`/admin/players/${id}`);
    } catch (err) {
      const player = mockPlayers.find((p) => String(p.id) === String(id)) || mockPlayers[0];
      return { data: player };
    }
  },
  updatePlayerStatus: (id, status) => api.patch(`/admin/players/${id}/status`, { status }).catch(() => ({ data: { id, status } })),
  updatePlayerRoster: (id, rosterData) => api.patch(`/admin/players/${id}/roster`, rosterData).catch(() => ({ data: rosterData })),
  updatePlayer: (id, data) => api.put(`/admin/players/${id}`, data).catch(() => ({ data })),
  deletePlayer: (id) => api.delete(`/admin/players/${id}`).catch(() => ({ data: { id } })),

  // Pages & Public Directory Management
  getPages: () => safeCall(() => api.get('/admin/pages'), 'muj_admin_pages', null),
  createPage: (data) => api.post('/admin/pages', data).catch(() => ({ data })),
  updatePage: (id, data) => api.put(`/admin/pages/${id}`, data).catch(() => ({ data })),
  deletePage: (id) => api.delete(`/admin/pages/${id}`).catch(() => ({ data: { id } }))
};