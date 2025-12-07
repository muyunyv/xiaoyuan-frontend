import api from './api';

export const searchService = {
  search: async (params: {
    q?: string;
    schoolName?: string;
    majorName?: string;
    category?: string;
    page?: number;
    limit?: number;
  }) => {
    return api.get('/search', { params });
  },

  getSuggestions: async (q: string) => {
    return api.get('/search/suggestions', { params: { q } });
  }
};



