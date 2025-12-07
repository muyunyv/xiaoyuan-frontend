// src/utils/validation.ts
export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export const validate = {
  // 用户名验证
  username: (value: string): ValidationResult => {
    if (!value || value.trim() === '') {
      return { isValid: false, message: '用户名不能为空' };
    }
    if (value.length < 3) {
      return { isValid: false, message: '用户名至少3个字符' };
    }
    if (value.length > 15) {
      return { isValid: false, message: '用户名不能超过15个字符' };
    }
    if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(value)) {
      return { isValid: false, message: '用户名只能包含中文、字母、数字和下划线' };
    }
    return { isValid: true };
  },

  // 密码验证
  password: (value: string): ValidationResult => {
    if (!value || value.trim() === '') {
      return { isValid: false, message: '密码不能为空' };
    }
    if (value.length < 6) {
      return { isValid: false, message: '密码至少6个字符' };
    }
    if (value.length > 20) {
      return { isValid: false, message: '密码不能超过20个字符' };
    }
    if (!/(?=.*[a-z])/.test(value)) {
      return { isValid: false, message: '密码必须包含小写字母' };
    }
    if (!/(?=.*[A-Z])/.test(value)) {
      return { isValid: false, message: '密码必须包含大写字母' };
    }
    if (!/(?=.*\d)/.test(value)) {
      return { isValid: false, message: '密码必须包含数字' };
    }
    return { isValid: true };
  },

  // 邮箱验证
  email: (value: string): ValidationResult => {
    if (!value || value.trim() === '') {
      return { isValid: false, message: '邮箱不能为空' };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return { isValid: false, message: '请输入有效的邮箱地址' };
    }
    return { isValid: true };
  },

  // 验证码验证
  verificationCode: (value: string): ValidationResult => {
    if (!value || value.trim() === '') {
      return { isValid: false, message: '验证码不能为空' };
    }
    if (!/^\d{6}$/.test(value)) {
      return { isValid: false, message: '验证码必须是6位数字' };
    }
    return { isValid: true };
  },

  // 确认密码验证
  confirmPassword: (password: string, confirmPassword: string): ValidationResult => {
    if (!confirmPassword || confirmPassword.trim() === '') {
      return { isValid: false, message: '请确认密码' };
    }
    if (password !== confirmPassword) {
      return { isValid: false, message: '两次输入的密码不一致' };
    }
    return { isValid: true };
  },

  // 表单整体验证
  registerForm: (data: {
    username: string;
    password: string;
    confirmPassword: string;
    email: string;
    verificationCode: string;
    verificationAnswer: string;
    agreeTerms: boolean;
  }): ValidationResult => {
    const validations = [
      validate.username(data.username),
      validate.password(data.password),
      validate.confirmPassword(data.password, data.confirmPassword),
      validate.email(data.email),
      validate.verificationCode(data.verificationCode)
    ];

    const firstError = validations.find(v => !v.isValid);
    if (firstError) {
      return firstError;
    }

    if (!data.verificationAnswer || (data.verificationAnswer !== '是' && data.verificationAnswer !== 'yes')) {
      return { isValid: false, message: '必须同意论坛规则才能注册' };
    }

    if (!data.agreeTerms) {
      return { isValid: false, message: '请同意服务条款' };
    }

    return { isValid: true };
  }
};
