import { useState, useEffect } from 'react';
import { Input, Card, List, Avatar, Tag, Button, Space, Empty, message } from 'antd';
import { SearchOutlined, LikeOutlined, DislikeOutlined, MinusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { postService, Post } from '../services/postService';
import { evaluationService } from '../services/evaluationService';
import { searchService } from '../services/searchService';
import { useAuth } from '../contexts/AuthContext';

const { Search } = Input;

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const response = await postService.getPosts({ page: 1, limit: 20 });
      setPosts(response.data.posts || []);
    } catch (error) {
      console.error('加载帖子失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (value: string) => {
    if (!value.trim()) {
      loadPosts();
      return;
    }

    setLoading(true);
    try {
      const response = await searchService.search({ q: value, page: 1, limit: 20 });
      setPosts(response.data.posts || []);
    } catch (error) {
      console.error('搜索失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluate = async (postId: string, type: 'like' | 'neutral' | 'dislike') => {
    if (!user) {
      message.warning('请先登录');
      navigate('/login');
      return;
    }

    try {
      await evaluationService.evaluatePost(postId, type);
      loadPosts();
    } catch (error: any) {
      message.error(error.message || '评价失败');
    }
  };

  const getCategoryName = (category: string) => {
    const categoryMap: Record<string, string> = {
      campus: '校园环境',
      dormitory: '宿舍条件',
      major: '专业详情',
      cost: '费用信息',
      employment_rate: '就业率数据',
      job_info: '对口工作信息'
    };
    return categoryMap[category] || category;
  };

  return (
    <div>
      <Search
        placeholder="搜索学校或专业..."
        allowClear
        enterButton={<SearchOutlined />}
        size="large"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onSearch={handleSearch}
        style={{ marginBottom: 24 }}
      />

      {posts.length === 0 && !loading ? (
        <Empty description="暂无内容" />
      ) : (
        <List
          loading={loading}
          itemLayout="vertical"
          dataSource={posts}
          renderItem={(post) => (
            <List.Item>
              <Card
                hoverable
                onClick={() => navigate(`/post/${post.id}`)}
                style={{ width: '100%' }}
              >
                <Card.Meta
                  avatar={<Avatar>{post.author.username[0]}</Avatar>}
                  title={
                    <div>
                      <span>{post.title}</span>
                      <Tag color="blue" style={{ marginLeft: 8 }}>
                        {getCategoryName(post.category)}
                      </Tag>
                    </div>
                  }
                  description={
                    <div>
                      <div>{post.schoolName} {post.majorName && `· ${post.majorName}`}</div>
                      <div style={{ marginTop: 8, color: '#666' }}>
                        {post.content.substring(0, 200)}...
                      </div>
                      {post.evaluationStats && (
                        <Space style={{ marginTop: 12 }}>
                          <Button
                            icon={<LikeOutlined />}
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEvaluate(post.id, 'like');
                            }}
                          >
                            {post.evaluationStats.likes}
                          </Button>
                          <Button
                            icon={<MinusOutlined />}
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEvaluate(post.id, 'neutral');
                            }}
                          >
                            {post.evaluationStats.neutrals}
                          </Button>
                          <Button
                            icon={<DislikeOutlined />}
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEvaluate(post.id, 'dislike');
                            }}
                          >
                            {post.evaluationStats.dislikes}
                          </Button>
                        </Space>
                      )}
                    </div>
                  }
                />
              </Card>
            </List.Item>
          )}
        />
      )}
    </div>
  );
}

