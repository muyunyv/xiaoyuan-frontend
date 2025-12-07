import { useState, useEffect } from 'react';
import { Card, Button, Tag, Space, List, Empty } from 'antd';
import { PlusOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { postService, Post } from '../services/postService';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadMyPosts();
    }
  }, [user]);

  const loadMyPosts = async () => {
    setLoading(true);
    try {
      // 这里应该调用获取当前用户帖子的接�?
      // 简化处理，使用通用接口
      const response = await postService.getPosts({ page: 1, limit: 20 });
      setMyPosts(response.data.posts || []);
    } catch (error) {
      console.error('加载我的帖子失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2>{user.username}</h2>
            <Space>
              <Tag color={user.isVerified ? 'green' : 'default'}>
                {user.isVerified ? (
                  <>
                    <CheckCircleOutlined /> 已认证大学生
                  </>
                ) : (
                  <>
                    <CloseCircleOutlined /> 未认�?
                  </>
                )}
              </Tag>
              <Tag>信誉�? {user.reputation}</Tag>
            </Space>
          </div>
          <Space>
            {user.isVerified && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => navigate('/create-post')}
              >
                发布内容
              </Button>
            )}
            {!user.isVerified && (
              <Button type="primary" onClick={() => navigate('/verify-student')}>
                大学生认�?
              </Button>
            )}
            <Button onClick={logout}>退出登�?/Button>
          </Space>
        </div>
      </Card>

      <Card title="我的发布" style={{ marginTop: 24 }}>
        <List
          loading={loading}
          dataSource={myPosts}
          renderItem={(post) => (
            <List.Item
              actions={[
                <Button type="link" onClick={() => navigate(`/post/${post.id}`)}>
                  查看
                </Button>
              ]}
            >
              <List.Item.Meta
                title={post.title}
                description={`${post.schoolName} · ${post.status === 'approved' ? '已通过' : '待审�?}`}
              />
            </List.Item>
          )}
          locale={{ emptyText: <Empty description="暂无发布内容" /> }}
        />
      </Card>
    </div>
  );
}




