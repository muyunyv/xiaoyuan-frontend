import React, { useState, useEffect } from "react";
import { Card, Button, Tag, Space, List, Empty, Avatar, Divider } from "antd";
import { EditOutlined, MailOutlined, SafetyOutlined, LogoutOutlined } from "@ant-design/icons";

interface Post {
  id: string;
  title: string;
  schoolName: string;
  status: string;
}

const Profile: React.FC = () => {
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  const user = {
    username: "测试用户",
    email: "test@example.com",
    isVerified: true,
    reputation: 100,
    violationCount: 0,
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  useEffect(() => {
    // 模拟获取用户帖子
    setLoading(true);
    setTimeout(() => {
      setUserPosts([
        { id: "1", title: "计算机专业就业情况", schoolName: "清华大学", status: "approved" },
        { id: "2", title: "人工智能发展趋势", schoolName: "北京大学", status: "pending" },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div style={{ padding: "24px", maxWidth: "1000px", margin: "0 auto" }}>
      <Card
        title="个人资料"
        extra={
          <Space>
            <Button type="primary" icon={<EditOutlined />}>
              编辑资料
            </Button>
            <Button onClick={logout} icon={<LogoutOutlined />}>
              退出登录
            </Button>
          </Space>
        }
      >
        <div style={{ display: "flex", alignItems: "center", marginBottom: "24px" }}>
          <Avatar size={64} style={{ backgroundColor: "#1890ff", fontSize: "24px" }}>
            {user.username.charAt(0)}
          </Avatar>
          <div style={{ marginLeft: "16px" }}>
            <h2 style={{ margin: 0 }}>{user.username}</h2>
            <Space style={{ marginTop: "8px" }}>
              <span>
                <MailOutlined /> {user.email}
              </span>
              {user.isVerified ? (
                <Tag color="green" icon={<SafetyOutlined />}>
                  已验证
                </Tag>
              ) : (
                <Tag color="red">未验证</Tag>
              )}
            </Space>
          </div>
        </div>

        <Divider />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px" }}>
          <Card size="small" title="信誉分">
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "32px", fontWeight: "bold", color: "#1890ff" }}>
                {user.reputation}
              </div>
              <div style={{ color: "#999", marginTop: "8px" }}>分</div>
            </div>
          </Card>

          <Card size="small" title="违规次数">
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "32px", fontWeight: "bold", color: user.violationCount === 0 ? "#52c41a" : "#f5222d" }}>
                {user.violationCount}
              </div>
              <div style={{ color: "#999", marginTop: "8px" }}>次</div>
            </div>
          </Card>
        </div>
      </Card>

      <Card title="我的帖子" style={{ marginTop: "24px" }}>
        <List
          loading={loading}
          locale={{ emptyText: <Empty description="暂无帖子" /> }}
          dataSource={userPosts}
          renderItem={(post) => (
            <List.Item
              key={post.id}
              actions={[
                <Button size="small" key="edit">
                  编辑
                </Button>,
                <Button size="small" danger key="delete">
                  删除
                </Button>,
              ]}
            >
              <List.Item.Meta
                title={post.title}
                description={`${post.schoolName} · ${post.status === "approved" ? "已通过" : "待审核"}`}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default Profile;
