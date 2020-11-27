/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-restricted-globals */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint react/jsx-props-no-spreading: off */
import { Button, Result, Spin } from 'antd';
import { SpinProps } from 'antd/lib/spin';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Switch, Route, Redirect, useHistory } from 'react-router-dom';
import App from './containers/App';
import { logoutUser } from './features/login/login.store';
import { RootState } from './store';

// Lazily load routes and code split with webpack
const LazyLoginPage = React.lazy(() =>
  import(/* webpackChunkName: "LoginPage" */ './containers/LoginPage')
);

const LazyHomePage = React.lazy(() =>
  import(/* webpackChunkName: "HomePage" */ './containers/HomePage')
);

const LazyMonthPage = React.lazy(() =>
  import(/* webpackChunkName: "MonthPage" */ './containers/MonthPage')
);

const LazySettingsPage = React.lazy(() =>
  import(/* webpackChunkName: "SettingsPage" */ './containers/SettingsPage')
);

const LazyConfigurationPage = React.lazy(() =>
  import(
    /* webpackChunkName: "ConfigurationPage" */ './containers/ConfigurationPage'
  )
);

const Loading: React.FC<SpinProps> = (props) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    }}
  >
    <Spin {...props} />
  </div>
);

const LoginPage = (props: Record<string, string>) => {
  const token = useSelector((state: RootState) => state.auth.token);
  if (token) return <Redirect to="/" />;
  return (
    <React.Suspense fallback={<Loading tip="Загрузка..." />}>
      <LazyLoginPage {...props} />
    </React.Suspense>
  );
};

const SettingsPage = (props: Record<string, string>) => {
  const token = useSelector((state: RootState) => state.auth.token);
  if (!token) return <Redirect to="/login" />;
  return (
    <React.Suspense fallback={<Loading tip="Загрузка..." />}>
      <LazySettingsPage {...props} />
    </React.Suspense>
  );
};

const ConfigurationPage = (props: Record<string, string>) => {
  const token = useSelector((state: RootState) => state.auth.token);
  if (!token) return <Redirect to="/login" />;
  return (
    <React.Suspense fallback={<Loading tip="Загрузка..." />}>
      <LazyConfigurationPage {...props} />
    </React.Suspense>
  );
};

const HomePage = (props: Record<string, string>) => {
  const token = useSelector((state: RootState) => state.auth.token);
  if (!token) return <Redirect to="/login" />;
  return (
    <React.Suspense fallback={<Loading tip="Загрузка..." />}>
      <LazyHomePage {...props} />
    </React.Suspense>
  );
};

const MonthPage = (props: Record<string, string>) => {
  const token = useSelector((state: RootState) => state.auth.token);
  if (!token) return <Redirect to="/" />;
  return (
    <React.Suspense fallback={<Loading tip="Загрузка..." />}>
      <LazyMonthPage {...props} />
    </React.Suspense>
  );
};

const RedirectButton = () => {
  const history = useHistory();
  return (
    <Button type="primary" onClick={() => history.push('/login')}>
      Авторизация
    </Button>
  );
};

const LogoutPage = () => {
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(logoutUser());
  }, []);
  return (
    <Result
      status="403"
      title=""
      subTitle="Вы успешно вышли из системы."
      extra={<RedirectButton />}
    />
  );
};

function PageRoutes() {
  const { salary, hours_per_day } = useSelector(
    (state: RootState) => state.settings
  );
  if (salary === null || hours_per_day === null)
    return <Redirect to="/configuration" />;
  return (
    <Switch>
      <Route path="/" exact component={HomePage} />
      <Route path="/month" exact component={MonthPage} />
    </Switch>
  );
}

export default function Routes() {
  return (
    <App>
      <Switch>
        <Route path="/login" exact component={LoginPage} />
        <Route path="/logout" exact component={LogoutPage} />
        <Route path="/configuration" exact component={ConfigurationPage} />
        <Route path="/settings" exact component={SettingsPage} />
        <PageRoutes />
      </Switch>
    </App>
  );
}
