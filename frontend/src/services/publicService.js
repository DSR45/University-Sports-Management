import api from './axiosConfig';

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

const getList = async (endpoint) => {
  const response = await api.get(endpoint);
  return unwrapList(response.data);
};

const getObject = async (endpoint) => {
  const response = await api.get(endpoint);
  return unwrapObject(response.data);
};

export const publicService = {
  getPlayers: () => getList('/public/team'),

  getMatches: () => getList('/public/matches'),

  getLatestResult: () => getObject('/public/matches/latest-result'),

  getNews: () => getList('/public/news'),

  getNewsBySlug: (slug) => getObject(`/public/news/${slug}`),

  getAchievements: () => getList('/public/achievements'),

  getEvents: () => getList('/public/events'),

  getGallery: () => getList('/public/gallery'),

  getVideos: () => getList('/public/videos'),

  getTeamInfo: () => getObject('/public/team-info')
};