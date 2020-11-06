import { remote } from 'electron';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Statistic } from 'antd';
import { fetchUser, selectUser } from '../login/login.store';
import LayoutApp from '../../containers/Layout';
import { fetchActivity, toggleActivity, tick as _Tick } from './home.store';
import { RootState } from '../../store';

function secondsToHms(d: number) {
  const h = Math.floor(d / 3600);
  const m = Math.floor((d % 3600) / 60);
  const s = Math.floor((d % 3600) % 60);

  const hDisplay = h > 0 ? `${h < 10 ? `0${h.toString()}` : h}:` : '';
  const mDisplay = `${m < 10 ? `0${m.toString()}` : m}:`;
  const sDisplay = `${s < 10 ? `0${s.toString()}` : s}`;
  return `${hDisplay}${mDisplay}${sDisplay}`;
}

function TimerComponent() {
  const { currentTime, status } = useSelector(
    (state: RootState) => state.activity
  );
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
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'calc(100vh - 64px)',
        flexDirection: 'column',
      }}
    >
      <Statistic
        title="Таймер"
        value={secondsToHms(currentTime)}
        style={{ textAlign: 'center' }}
      />
      <Button
        style={{ marginTop: 16 }}
        danger={status}
        type="primary"
        onClick={() => dispatch(toggleActivity())}
      >
        {status ? 'Пауза' : 'Начать'}
      </Button>
    </div>
  );
}

export default function HomeComponent() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  React.useEffect(() => {
    if (!user) {
      dispatch(fetchUser());
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  React.useEffect(() => {
    dispatch(fetchActivity());
  }, []);
  return (
    <LayoutApp>
      <TimerComponent />
    </LayoutApp>
  );
}
