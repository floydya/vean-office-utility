/* eslint-disable react-hooks/exhaustive-deps */
import { Alert, Layout, Menu } from 'antd';
import { remote } from 'electron';
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
  const remind = useSelector((state: RootState) => state.auth.remind);
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
      <Menu.Item key="/settings" style={{ marginLeft: 'auto' }}>
        Настройки
      </Menu.Item>
      {!remind && <Menu.Item key="/logout">Выйти</Menu.Item>}
    </Menu>
  );
}

const useOnline = () => {
  const [online, setOnline] = React.useState<boolean | null>(null);
  const handleOnline = React.useCallback(() => {
    setOnline(navigator.onLine);
  }, []);
  React.useEffect(() => {
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [handleOnline]);
  React.useEffect(() => {
    window.addEventListener('offline', handleOnline);
    return () => window.removeEventListener('offline', handleOnline);
  }, [handleOnline]);
  return online;
};

const useNotification = () => {
  const { status } = useSelector((state: RootState) => state.activity);
  const notificationRef = React.useRef(null);
  const showNotification = React.useCallback(() => {
    const notification = new Notification('Внимание!', {
      body: 'У Вас отключен таймер рабочего времени! Не забудьте его включить.',
    });
  }, []);
  React.useEffect(() => {
    if (status) {
      notificationRef.current = remote.getGlobal('setInterval')(
        showNotification,
        1000 * 60 * 5
      );
    } else {
      remote.getGlobal('clearInterval')(notificationRef.current);
      notificationRef.current = null;
    }
    return () => {
      if (notificationRef.current) {
        remote.getGlobal('clearInterval')(notificationRef.current);
        notificationRef.current = null;
      }
    };
  }, [status]);
};

export default function LayoutApp(props: Props) {
  const { children } = props;
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const online = useOnline();
  React.useEffect(() => {
    if (!user) {
      dispatch(fetchUser());
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Layout>
      {online === false && (
        <Alert
          type="error"
          message="Отсутствует подключение к интернету!"
          showIcon
        />
      )}
      <Layout.Header>
        <Header />
      </Layout.Header>
      <Layout.Content style={{ padding: '15px' }}>{children}</Layout.Content>
    </Layout>
  );
}
