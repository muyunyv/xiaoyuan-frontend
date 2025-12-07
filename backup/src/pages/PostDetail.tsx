import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Space, Tag, message, Spin, Image } from 'antd';
import { LikeOutlined, DislikeOutlined, MinusOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { postService, Post } from '../services/postService';
import { evaluationService } from '../services/evaluationService';
import { useAuth } from '../contexts/AuthContext';

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      loadPost(id);
    }
  }, [id]);

  const loadPost = async (postId: string) => {
    setLoading(true);
    try {
      const response = await postService.getPost(postId);
      setPost(response.data);
    } catch (error) {
      message.error('加载帖子失败');
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluate = async (type: 'like' | 'neutral' | 'dislike') => {
    if (!user) {
      message.warning('请先登录');
      navigate('/login');
      return;
    }

    if (!id) return;

    try {
      await evaluationService.evaluatePost(id, type);
      message.success('评价成功');
      loadPost(id);
    } catch (error: any) {
      message.error(error.message || '评价失败');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!post) {
    return <div>帖子不存在</div>;
  }

  return (
    <div>
      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>
        返回
      </Button>

      <Card>
        <h1>{post.title}</h1>
        <Space style={{ marginBottom: 16 }}>
          <Tag color="blue">{post.schoolName}</Tag>
          {post.majorName && <Tag>{post.majorName}</Tag>}
          <span>作者: {post.author.username}</span>
          <span>信誉值: {post.author.reputation}</span>
        </Space>

        <div style={{ marginBottom: 16, whiteSpace: 'pre-wrap' }}>
          {post.content}
        </div>

        {post.images && post.images.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <Image.PreviewGroup>
              {post.images.map((img) => (
                <Image
                  key={img.id}
                  src={`http://localhost:3000/${img.imageUrl}`}
                  width={200}
                  style={{ marginRight: 8, marginBottom: 8 }}
                />
              ))}
            </Image.PreviewGroup>
          </div>
        )}

        {post.evaluationStats && (
          <div>
            <Space>
              <Button
                icon={<LikeOutlined />}
                onClick={() => handleEvaluate('like')}
              >
                赞 ({post.evaluationStats.likes})
              </Button>
              <Button
                icon={<MinusOutlined />}
                onClick={() => handleEvaluate('neutral')}
              >
                中立 ({post.evaluationStats.neutrals})
              </Button>
              <Button
                icon={<DislikeOutlined />}
                onClick={() => handleEvaluate('dislike')}
              >
                踩 ({post.evaluationStats.dislikes})
              </Button>
            </Space>
            <div style={{ marginTop: 8, color: '#666' }}>
              总评价数: {post.evaluationStats.total}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}



