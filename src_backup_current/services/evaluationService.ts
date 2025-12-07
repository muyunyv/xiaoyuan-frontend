import api from './api';

export type EvaluationType = 'like' | 'neutral' | 'dislike';

export const evaluationService = {
  evaluatePost: async (postId: string, type: EvaluationType) => {
    return api.post(`/evaluations/${postId}`, { type });
  },

  getPostEvaluationStats: async (postId: string) => {
    return api.get(`/evaluations/${postId}/stats`);
  }
};



