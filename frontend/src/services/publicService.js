import { mockPlayers } from '../data/mock/players';
import { mockMatches } from '../data/mock/matches';
import { mockNews } from '../data/mock/news';
import { mockAchievements } from '../data/mock/achievements';
import { mockEvents } from '../data/mock/events';
import { mockGallery } from '../data/mock/gallery';
import { mockVideos } from '../data/mock/videos';
import { mockTeamInfo } from '../data/mock/team';

// Simulation of API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const publicService = {
  getPlayers: async () => {
    await delay(500);
    return mockPlayers;
  },

  getMatches: async () => {
    await delay(500);
    return mockMatches;
  },

  getLatestResult: async () => {
    await delay(500);
    return mockMatches.find(m => m.status === 'completed');
  },

  getNews: async () => {
    await delay(500);
    return mockNews;
  },

  getNewsBySlug: async (slug) => {
    await delay(500);
    return mockNews.find(n => n.slug === slug);
  },

  getAchievements: async () => {
    await delay(500);
    return mockAchievements;
  },

  getEvents: async () => {
    await delay(500);
    return mockEvents;
  },

  getGallery: async () => {
    await delay(500);
    return mockGallery;
  },

  getVideos: async () => {
    await delay(500);
    return mockVideos;
  },

  getTeamInfo: async () => {
    await delay(500);
    return mockTeamInfo;
  }
};