import { useState, useEffect } from 'react';
import { Card, List, Empty, Tabs } from 'antd';
import { useNavigate } from 'react-router-dom';
import { postService, Post } from '../services/postService';

const categories = [
  { key: 'campus', label: '校园环境' },
  { key: 'dormitory', label: '宿舍条件' },
  { key: 'major', label: '专业详情' },
  { key: 'cost', label: '费用信息' },
  { key: 'employment_rate', label: '就业率数�? },
  { key: 'job_info', label: '对口工作信息' }
];

export default function Explore() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('campus');
  const navigate = useNavigate();

  useEffect(() => {
    loadPosts(activeCategory);
  }, [activeCategory]);

  const loadPosts = async (category: string) => {
    setLoading(true);
    try {
      const response = await postService.getPosts({ category, page: 1, limit: 20 });
      setPosts(response.data.posts || []);
    } catch (error) {
      console.error('加载帖子失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Tabs
        activeKey={activeCategory}
        onChange={setActiveCategory}
        items={categories.map(cat => ({
          key: cat.key,
          label: cat.label,
          children: (
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
                      title={post.title}
                      description={
                        <div>
                          <div>{post.schoolName} {post.majorName && `· ${post.majorName}`}</div>
                          <div style={{ marginTop: 8, color: '#666' }}>
                            {post.content.substring(0, 200)}...
                          </div>
                        </div>
                      }
                    />
                  </Card>
                </List.Item>
              )}
              locale={{ emptyText: <Empty description="暂无内容" /> }}
            />
          )
        }))}
      />
    </div>
  );
}




