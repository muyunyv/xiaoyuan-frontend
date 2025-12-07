import api from './api';

export interface RegisterData {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  verificationAnswer: string;
  verificationCode: string;
  agreeTerms: boolean;
}

export interface LoginData {
  username: string;
  password: string;
  securityQuestion?: string;
  securityAnswer?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  isVerified: boolean;
  reputation: number;
  violationCount?: number;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const authService = {
  // 发送验证码
  sendVerificationCode: async (email: string): Promise<ApiResponse> => {
    try {
      const response = await api.post('/auth/send-verification-code', { email });
      return {
        success
      : response.status >= 200 && response.status < 300,
        data
      : response.data,
        message
      : response.
      statusText
      };
    } catch (error: any) {
      console.error('发送验证码失败:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '发送验证码失败'
      };
    }
  },

  // 注册
  register: async (data: RegisterData): Promise<ApiResponse> => {
    try {
      const response = await api.post('/auth/register', data);
      if (response.data.success && response.data?.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user || {}));
      }
      return {
        success
      : response.status >= 200 && response.status < 300,
        data
      : response.data,
        message
      : response.
      statusText
      };
    } catch (error: any) {
      console.error('注册失败:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '注册失败'
      };
    }
  },

  // 登录
  login: async (data: LoginData): Promise<ApiResponse> => {
    try {
      const response = await api.post('/auth/login', data);
      if (response.data.success && response.data?.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user || {}));
      }
      return {
        success
      : response.status >= 200 && response.status < 300,
        data
      : response.data,
        message
      : response.
      statusText
      };
    } catch (error: any) {
      console.error('登录失败:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '登录失败'
      };
    }
  },

  // 登出
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // 获取当前用户
  getCurrentUser: async (): Promise<{success: boolean; data?: User; message?: string}> => {
    try {
      const response = await api.get('/auth/me');
      if (response.data.success && response.data.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
        return {
          success
        : response.status >= 200 && response.status < 300,
          data
        : response.data,
          message
        : response.
        statusText
        };
    } catch (error: any) {
      console.error('获取用户信息失败:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '获取用户信息失败'
      };
    }
  },

  // 验证邮箱
  verifyEmail: async (token: string): Promise<ApiResponse> => {
    try {
      const response = await api.get(`/auth/verify-email?token=${token}`);
        return {
          success
        : response.status >= 200 && response.status < 300,
          data
        : response.data,
          message
        : response.
        statusText
        };
    } catch (error: any) {
      console.error('邮箱验证失败:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '邮箱验证失败'
      };
    }
  },

  // 请求重置密码
  requestPasswordReset: async (email: string): Promise<ApiResponse> => {
    try {
      const response = await api.post('/auth/request-password-reset', { email });
      return {
        success
      : response.status >= 200 && response.status < 300,
        data
      : response.data,
        message
      : response.
      statusText
      };
    } catch (error: any) {
      console.error('请求重置密码失败:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '请求重置密码失败'
      };
    }
  },

  // 重置密码
  resetPassword: async (token: string, newPassword: string): Promise<ApiResponse> => {
    try {
      const response = await api.post('/auth/reset-password', { token, newPassword });
      return {
        success
      : response.status >= 200 && response.status < 300,
        data
      : response.data,
        message
      : response.
      statusText
      };
    } catch (error: any) {
      console.error('重置密码失败:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '重置密码失败'
      };
    }
  },

  // 获取本地存储的用户信息
  getLocalUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // 获取本地token
  getLocalToken: (): string | null => {
    return localStorage.getItem('token');
  },

  // 检查是否已登录
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  // 刷新token（如果需要）
  refreshToken: async (): Promise<ApiResponse> => {
    try {
      const response = await api.post('/auth/refresh-token');
      if (response.data.success && response.data?.token) {
        localStorage.setItem('token', response.data.token);
      }
      return {
        success
      : response.status >= 200 && response.status < 300,
        data
      : response.data,
        message
      : response.
      statusText
      };
    } catch (error: any) {
      console.error('刷新token失败:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '刷新token失败'
      };
    }
  }
};
