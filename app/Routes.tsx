/* eslint react/jsx-props-no-spreading: off */
import { Spin } from 'antd';
import { SpinProps } from 'antd/lib/spin';
import React from 'react';
import { useSelector } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import App from './containers/App';
import { RootState } from './store';

// Lazily load routes and code split with webpack
const LazyLoginPage = React.lazy(() =>
  import(/* webpackChunkName: "LoginPage" */ './containers/LoginPage')
);

const LazyHomePage = React.lazy(() =>
  import(/* webpackChunkName: "HomePage" */ './containers/HomePage')
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

const LoginPage = (props: Record<string, any>) => (
  <React.Suspense fallback={<Loading tip="Загрузка..." />}>
    <LazyLoginPage {...props} />
  </React.Suspense>
);

const HomePage = (props: Record<string, any>) => (
  <React.Suspense fallback={<Loading tip="Загрузка..." />}>
    <LazyHomePage {...props} />
  </React.Suspense>
);

export default function Routes() {
  const token = useSelector((state: RootState) => state.auth.token);
  return (
    <App>
      <Switch>
        <Route path="/" component={!token ? LoginPage : HomePage} />
      </Switch>
    </App>
  );
}
