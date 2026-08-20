import api from './axiosConfig';
import { mockNews } from '../data/mock/news';
import { mockEvents } from '../data/mock/events';
import { mockMatches } from '../data/mock/matches';
import { mockAchievements } from '../data/mock/achievements';
import { mockGallery } from '../data/mock/gallery';
import { mockVideos } from '../data/mock/videos';
import { mockPlayers } from '../data/mock/players';
import { mockTeamInfo } from '../data/mock/team';

const unwrapList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.content)) return payload.content;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
};

const unwrapObject = (payload) => {
  if (payload?.data && !Array.isArray(payload.data)) return payload.data;
  return payload || {};
};

const safePublicList = async (endpoint, storageKey, defaultData = []) => {
  try {
    const response = await api.get(endpoint);
    const unwrapped = unwrapList(response.data);
    if (Array.isArray(unwrapped) && unwrapped.length > 0) {
      return unwrapped;
    }
  } catch (err) {
    // ignore API error and fallback
  }

  if (storageKey) {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        // ignore parse error
      }
    }
  }

  return defaultData;
};

const safePublicObject = async (endpoint, storageKey, defaultData = {}) => {
  try {
    const response = await api.get(endpoint);
    const unwrapped = unwrapObject(response.data);
    if (unwrapped && Object.keys(unwrapped).length > 0) {
      return unwrapped;
    }
  } catch (err) {
    // ignore API error and fallback
  }

  if (storageKey) {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed) return parsed;
      } catch (e) {
        // ignore parse error
      }
    }
  }

  return defaultData;
};

export const publicService = {
  getPlayers: () => safePublicList('/public/team', 'muj_admin_players', mockPlayers),

  getMatches: () => safePublicList('/public/matches', 'muj_admin_matches', mockMatches),

  getLatestResult: async () => {
    try {
      const response = await api.get('/public/matches/latest-result');
      const unwrapped = unwrapObject(response.data);
      if (unwrapped && (unwrapped.opponent || unwrapped.id)) return unwrapped;
    } catch (err) {
      // API call failed, fallback to matches list
    }

    const matchesList = await publicService.getMatches();
    const completed = matchesList.filter(
      (m) =>
        String(m.status).toUpperCase() === 'COMPLETED' ||
        m.ourScore !== undefined ||
        (m.result && String(m.result).includes('-'))
    );
    if (completed.length > 0) {
      return completed[0];
    }
    return matchesList[0] || null;
  },

  getNews: () => safePublicList('/public/news', 'muj_admin_news', mockNews),

  getNewsBySlug: async (slug) => {
    try {
      const response = await api.get(`/public/news/${slug}`);
      return unwrapObject(response.data);
    } catch (err) {
      const newsList = await publicService.getNews();
      return newsList.find((n) => n.slug === slug || String(n.id) === String(slug)) || newsList[0] || {};
    }
  },

  getAchievements: () => safePublicList('/public/achievements', 'muj_admin_achievements', mockAchievements),

  getEvents: () => safePublicList('/public/events', 'muj_admin_events', mockEvents),

  getGallery: () => safePublicList('/public/gallery', 'muj_admin_gallery', mockGallery),

  getVideos: () => safePublicList('/public/videos', 'muj_admin_videos', mockVideos),

  getTeamInfo: () => safePublicObject('/public/team-info', 'muj_admin_team_info', mockTeamInfo)
};
