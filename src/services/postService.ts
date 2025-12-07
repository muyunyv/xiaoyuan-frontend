import api from './api';

export interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  subCategory?: string;
  schoolName: string;
  majorName?: string;
  author: {
    id: string;
    username: string;
    reputation: number;
  };
  status: string;
  images: Array<{ id: string; imageUrl: string }>;
  evaluationStats?: {
    total: number;
    likes: number;
    neutrals: number;
    dislikes: number;
    likeRatio: number;
    dislikeRatio: number;
  };
  createdAt: string;
}

export interface CreatePostData {
  title: string;
  content: string;
  category: string;
  subCategory?: string;
  schoolName: string;
  majorName?: string;
  images?: File[];
}

export const postService = {
  getPosts: async (params?: {
    category?: string;
    schoolName?: string;
    majorName?: string;
    page?: number;
    limit?: number;
  }) => {
    return api.get('/posts', { params });
  },

  getPost: async (id: string) => {
    return api.get(`/posts/${id}`);
  },

  createPost: async (data: CreatePostData) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.content);
    formData.append('category', data.category);
    if (data.subCategory) formData.append('subCategory', data.subCategory);
    formData.append('schoolName', data.schoolName);
    if (data.majorName) formData.append('majorName', data.majorName);
    
    if (data.images) {
      data.images.forEach((image) => {
        formData.append('images', image);
      });
    }

    return api.post('/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};



