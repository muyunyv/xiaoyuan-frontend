import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout as AntLayout, Menu } from 'antd';
import { HomeOutlined, CompassOutlined, UserOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';

const { Header, Content, Footer } = AntLayout;

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: '首页'
    },
    {
      key: '/explore',
      icon: <CompassOutlined />,
      label: '探索'
    },
    {
      key: '/profile',
      icon: <UserOutlined />,
      label: user ? user.username : '我的'
    }
  ];

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
          校缘
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ flex: 1, justifyContent: 'flex-end' }}
        />
      </Header>
      <Content style={{ padding: '24px', minHeight: 'calc(100vh - 64px - 70px)' }}>
        <Outlet />
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        校缘 ©2025 真实的大学生活分享平台
      </Footer>
    </AntLayout>
  );
}



