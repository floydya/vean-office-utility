import { Layout, Menu } from 'antd';
import React, { ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { fetchUser, selectUser } from '../features/login/login.store';
import { RootState } from '../store';

type Props = {
  children: ReactNode;
};

function Header() {
  const location = useSelector(
    (state: RootState) => state.router.location.pathname
  );
  const history = useHistory();
  return (
    <Menu
      theme="dark"
      mode="horizontal"
      defaultSelectedKeys={[location]}
      style={{ display: 'flex' }}
      onClick={({ key }) => history.push(key as string)}
    >
      <Menu.Item key="/">Главная</Menu.Item>
      <Menu.Item key="/month">Месяц</Menu.Item>
      <Menu.Item key="/settings">Настройки</Menu.Item>
      <Menu.Item key="/logout" style={{ marginLeft: 'auto' }}>
        Выйти
      </Menu.Item>
    </Menu>
  );
}

export default function LayoutApp(props: Props) {
  const { children } = props;
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  React.useEffect(() => {
    if (!user) {
      dispatch(fetchUser());
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Layout>
      <Layout.Header>
        <Header />
      </Layout.Header>
      <Layout.Content style={{ padding: '15px' }}>{children}</Layout.Content>
    </Layout>
  );
}
