import { Layout, Menu } from 'antd';
import React, { ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import TimerComponent from '../components/TimerComponent';
import { logoutUser } from '../features/login/login.store';
import { RootState } from '../store';

type Props = {
  children: ReactNode;
};

function Header() {
  const location = useSelector(
    (state: RootState) => state.router.location.pathname
  );
  const history = useHistory();
  const dispatch = useDispatch();
  return (
    <Menu
      style={{ textAlign: 'center' }}
      theme="dark"
      mode="horizontal"
      defaultSelectedKeys={[location]}
      onClick={({ key }) => history.push(key as string)}
    >
      <Menu.Item key="/">Главная</Menu.Item>
      <Menu.Item key="/month">Месяц</Menu.Item>
      <Menu.Item key="logout" onClick={() => dispatch(logoutUser())}>
        Выйти
      </Menu.Item>
    </Menu>
  );
}

function Footer() {
  const location = useSelector(
    (state: RootState) => state.router.location.pathname
  );
  if (location === '/') return null;
  return (
    <Layout.Footer
      style={{
        position: 'absolute',
        bottom: '0',
        width: '100%',
        borderTop: '1px #177ddc solid',
        padding: '5px 45px',
      }}
    >
      <TimerComponent direction="row" />
    </Layout.Footer>
  );
};

export default function LayoutApp(props: Props) {
  const { children } = props;
  return (
    <Layout>
      <Layout.Header>
        <Header />
      </Layout.Header>
      <Layout.Content>{children}</Layout.Content>
      <Footer />
    </Layout>
  );
}
