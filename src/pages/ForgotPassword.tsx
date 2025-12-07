import React from "react";
import { Form, Input, Button, Card, message } from "antd";
import { Link } from "react-router-dom";

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = React.useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // 这里调用找回密码API
      console.log("找回密码:", values);
      message.success("重置链接已发送到邮箱");
    } catch (error: any) {
      message.error(error.message || "发送失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#f0f2f5" }}>
      <Card title="找回密码" style={{ width: 400 }}>
        <Form onFinish={onFinish} layout="vertical">
          <Form.Item
            label="邮箱"
            name="email"
            rules={[
              { required: true, message: "请输入邮箱" },
              { type: "email", message: "请输入有效的邮箱" }
            ]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              发送重置链接
            </Button>
          </Form.Item>
          
          <div style={{ textAlign: "center" }}>
            <Link to="/login">返回登录</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default ForgotPassword;
