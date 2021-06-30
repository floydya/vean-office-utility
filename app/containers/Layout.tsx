/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/require-default-props */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/naming-convention */
import { Alert, Layout, Menu } from 'antd';
import { remote } from 'electron';
import React, { ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { fetchUser, selectUser } from '../features/login/login.store';
import { RootState } from '../store';
import { tick as _Tick } from '../features/home/home.store';

type Props = {
  children: ReactNode;
  contentStyle?: unknown;
};

function Header() {
  const location = useSelector(
    (state: RootState) => state.router.location.pathname
  );
  const user = useSelector((state: RootState) => state.auth.user);
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
      {user?.is_superuser && <Menu.Item key="/impostor">Сотрудники</Menu.Item>}
      {user?.is_superuser && <Menu.Item key="/wallets">Баланс офиса</Menu.Item>}
      {user?.is_superuser && (
        <Menu.Item key="/incomingPayments">Входящие платежи</Menu.Item>
      )}
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
    new remote.Notification({
      title: 'Внимание!',
      body: 'У Вас отключен таймер рабочего времени! Не забудьте его включить.',
    }).show();
  }, []);
  React.useEffect(() => {
    if (!status) {
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

const useCurrentActivity = () => {
  const { status } = useSelector((state: RootState) => state.activity);
  const dispatch = useDispatch();
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const tick = () => {
    timerRef.current = remote.getGlobal('setTimeout')(tick, 1000);
    dispatch(_Tick());
  };
  React.useEffect(() => {
    if (status) {
      tick();
    } else {
      remote.getGlobal('clearTimeout')(timerRef.current);
    }
    return () => remote.getGlobal('clearTimeout')(timerRef.current);
  }, [status]);
  return null;
};

const useDayFinishedNotification = () => {
  const {
    settings: { hours_per_day },
    activity: { currentTime },
  } = useSelector((state: RootState) => state);
  const showNotification = React.useCallback(() => {
    new remote.Notification({
      title: 'Внимание!',
      body: 'Вы отработали свою дневную норму!',
    }).show();
  }, []);
  React.useEffect(() => {
    const seconds_per_day = hours_per_day * 60 * 60;
    if (currentTime === seconds_per_day) {
      showNotification();
    }
  }, [currentTime]);
};

export default function LayoutApp(props: Props) {
  const { children } = props;
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const online = useOnline();
  useCurrentActivity();
  useNotification();
  useDayFinishedNotification();
  React.useEffect(() => {
    if (!user) {
      dispatch(fetchUser());
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Layout style={{ height: '100%' }}>
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
      <Layout.Content style={{ padding: '15px', ...props.contentStyle }}>
        {children}
      </Layout.Content>
    </Layout>
  );
}
