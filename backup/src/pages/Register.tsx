import { useState, useRef, useEffect } from 'react';
import { Form, Input, Button, Card, message, Radio, Checkbox, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';

// 邮箱验证码状态类型
interface EmailCodeState {
  countdown: number;
  sending: boolean;
  lastSentTime: number;
}

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [emailCodeState, setEmailCodeState] = useState<EmailCodeState>({
    countdown: 0,
    sending: false,
    lastSentTime: 0
  });
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [form] = Form.useForm();
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 组件卸载时清理定时器
  useEffect(() => {
    return () => {
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
    };
  }, []);

  // 倒计时处理
  useEffect(() => {
    if (emailCodeState.countdown > 0) {
      countdownTimerRef.current = setInterval(() => {
        setEmailCodeState(prev => ({
          ...prev,
          countdown: prev.countdown - 1
        }));
      }, 1000);
    } else if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }

    return () => {
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
    };
  }, [emailCodeState.countdown]);

  // 发送邮箱验证码
  const sendEmailCode = async () => {
    const email = form.getFieldValue('email');
    
    // 验证邮箱格式
    if (!email) {
      message.error('请输入邮箱地址');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      message.error('请输入有效的邮箱地址');
      return;
    }

    // 防重复发送（60秒内只能发送一次）
    const now = Date.now();
    if (emailCodeState.lastSentTime && now - emailCodeState.lastSentTime < 60000) {
      const remainingSeconds = Math.ceil((60000 - (now - emailCodeState.lastSentTime)) / 1000);
      message.warning(`请等待${remainingSeconds}秒后再发送验证码`);
      return;
    }

    setEmailCodeState(prev => ({ ...prev, sending: true }));

    try {
      // 调用真实的验证码接口
      await authService.sendVerificationCode(email);
      
      message.success('验证码已发送到您的邮箱，请查收');
      setEmailCodeState({
        countdown: 60,
        sending: false,
        lastSentTime: Date.now()
      });
    } catch (error: any) {
      const errorMsg = error.message || '验证码发送失败';
      
      // 更友好的错误提示
      if (errorMsg.includes('频繁') || errorMsg.includes('频繁')) {
        message.warning('发送过于频繁，请稍后再试');
      } else if (errorMsg.includes('邮箱') || errorMsg.includes('无效')) {
        message.error('邮箱地址无效或不存在');
      } else if (errorMsg.includes('已注册')) {
        message.error('该邮箱已被注册，请直接登录');
      } else {
        message.error(`验证码发送失败: ${errorMsg}`);
      }
      
      setEmailCodeState(prev => ({ ...prev, sending: false }));
    }
  };

  // 表单提交处理
  const onFinish = async (values: any) => {
    if (!values.agreeTerms) {
      message.error('请同意服务条款');
      return;
    }

    if (values.verificationAnswer !== '是') {
      message.error('必须同意论坛规则才能注册');
      return;
    }

    // 验证码验证
    if (!values.verificationCode || values.verificationCode.length !== 6) {
      message.error('请输入6位验证码');
      return;
    }

    setLoading(true);
    try {
      await authService.register({
        username
      : values.username,
        password
      : values.password,
        email
      : values.email,
        verificationCode
      : values.verificationCode,
        confirmPassword
      : values.confirmPassword || values.password,
        verificationAnswer
      : values.verificationAnswer || "",
        agreeTerms
      : true
      });
      
      message.success({
        content: '注册成功！已向您的邮箱发送激活链接，请查收并激活账户',
        duration: 5
      });
      
      await refreshUser();
      navigate('/', { 
        state: { 
          message: '注册成功，请检查邮箱激活账户',
          type: 'success'
        }
      });
    } catch (error: any) {
      const errorMsg = error.message || '注册失败';
      
      // 更友好的错误处理
      if (errorMsg.includes('验证码')) {
        message.error('验证码错误或已过期，请重新获取');
        form.setFields([
          {
            name: 'verificationCode',
            errors: ['验证码错误或已过期']
          }
        ]);
      } else if (errorMsg.includes('用户名')) {
        message.error('用户名已存在，请换一个试试');
        form.setFields([
          {
            name: 'username',
            errors: ['用户名已存在']
          }
        ]);
      } else if (errorMsg.includes('邮箱')) {
        message.error('邮箱已被注册，请直接登录');
        form.setFields([
          {
            name: 'email',
            errors: ['邮箱已被注册']
          }
        ]);
      } else if (errorMsg.includes('密码')) {
        message.error('密码不符合安全要求');
      } else if (errorMsg.includes('网络')) {
        message.error('网络连接失败，请检查网络后重试');
      } else {
        message.error(`注册失败: ${errorMsg}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <Card 
        title={
          <div style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
            用户注册
          </div>
        }
        style={{ 
          width: 500, 
          maxWidth: '100%',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          borderRadius: '10px'
        }}
        bordered={false}
      >
        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          initialValues={{
            verificationAnswer: '是'
          }}
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, max: 15, message: '用户名长度必须在3-10个字符之间' },
              { pattern: /^[a-zA-Z0-9_]+$/, message: '只能包含字母、数字' }
            ]}
            validateTrigger={['onChange', 'onBlur']}
          >
            <Input 
              placeholder="3-10个字符，字母数字" 
              allowClear
            />
          </Form.Item>

          <Form.Item
            label="邮箱"
            name="email"
            rules={[
              { required: true, message: '请输入邮箱地址' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
            validateTrigger={['onChange', 'onBlur']}
          >
            <Input 
              placeholder="用于接收验证码和账户激活" 
              allowClear
            />
          </Form.Item>

          <Form.Item
            label="验证码"
            required
          >
            <Row gutter={8}>
              <Col span={16}>
                <Form.Item
                  name="verificationCode"
                  noStyle
                  rules={[
                    { required: true, message: '请输入验证码' },
                    { len: 6, message: '验证码为6位数字' },
                    { pattern: /^\d+$/, message: '验证码只能包含数字' }
                  ]}
                >
                  <Input 
                    placeholder="6位数字验证码" 
                    maxLength={6}
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Button
                  onClick={sendEmailCode}
                  disabled={emailCodeState.countdown > 0 || emailCodeState.sending}
                  block
                >
                  {emailCodeState.countdown > 0 
                    ? `${emailCodeState.countdown}秒后重发` 
                    : emailCodeState.sending 
                      ? '发送中...' 
                      : '获取验证码'
                  }
                </Button>
              </Col>
            </Row>
            <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
              验证码将发送到您的邮箱，有效期为10分钟
            </div>
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 8, message: "至少8个字符" },
              { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, 
                message: "需包含大小写字母、数字和特殊字符" }
            ]}
            validateTrigger="onBlur"
          >
            <Input.Password 
              placeholder="至少8位，包含大小写字母、数字和特殊字符" 
            />
          </Form.Item>

          <Form.Item
            label="确认密码"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                }
              })
            ]}
          >
            <Input.Password 
              placeholder="再次输入密码" 
            />
          </Form.Item>

          <Form.Item
            label="论坛规则确认:本论坛严禁发布虚假或诈骗信息、严禁侵犯他人人身权益、严禁发布违法违规内容，是否知晓？"
            name="verificationAnswer"
            rules={[{ required: true, message: '请选择' }]}
          >
            <Radio.Group>
              <Radio value="是">是，我已阅读并同意遵守论坛规则</Radio>
              <Radio value="否">否，我不同意</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item>
            <div style={{ 
              backgroundColor: '#f6f6f6', 
              padding: '12px', 
              borderRadius: '4px',
              marginBottom: '16px'
            }}>
              <Form.Item
                name="agreeTerms"
                valuePropName="checked"
                rules={[
                  {
                    validator: (_, value) =>
                      value ? Promise.resolve() : Promise.reject(new Error('请阅读并同意服务条款'))
                  }
                ]}
                noStyle
              >
                <Checkbox>
                  我已阅读并同意
                  <a 
                    href="/terms" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ margin: '0 4px' }}
                  >
                    《服务条款》
                  </a>
                  和
                  <a 
                    href="/privacy" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ marginLeft: '4px' }}
                  >
                    《隐私政策》
                  </a>
                </Checkbox>
              </Form.Item>
            </div>
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              loading={loading}
              size="large"
              style={{ 
                height: '50px', 
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              立即注册
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            已有账户？ 
            <a 
              href="/login" 
              style={{ 
                color: '#1890ff',
                fontWeight: 'bold',
                marginLeft: '4px'
              }}
            >
              立即登录
            </a>
          </div>
        </Form>
      </Card>
    </div>
  );
}