import { Layout, Menu } from 'antd';
import React, { ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../features/login/login.store';
import { RootState } from '../store';

type Props = {
  children: ReactNode;
};

function Header() {
  const location = useSelector(
    (state: RootState) => state.router.location.pathname
  );
  const dispatch = useDispatch();
  return (
    <Menu
      style={{ textAlign: 'center' }}
      theme="dark"
      mode="horizontal"
      defaultSelectedKeys={[location]}
    >
      <Menu.Item key="/">Главная</Menu.Item>
      <Menu.Item key="/month">Месяц</Menu.Item>
      <Menu.Item key="logout" onClick={() => dispatch(logoutUser())}>
        Выйти
      </Menu.Item>
    </Menu>
  );
}

export default function LayoutApp(props: Props) {
  const { children } = props;
  return (
    <Layout>
      <Layout.Header>
        <Header />
      </Layout.Header>
      <Layout.Content>{children}</Layout.Content>
    </Layout>
  );
}
