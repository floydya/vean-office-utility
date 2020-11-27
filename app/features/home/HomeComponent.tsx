/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import { useDispatch } from 'react-redux';
import LayoutApp from '../../containers/Layout';
import { fetchActivity } from './home.store';
import TimerComponent from '../../components/TimerComponent';

export default function HomeComponent() {
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(fetchActivity());
  }, []);
  return (
    <LayoutApp>
      <TimerComponent direction="column" />
    </LayoutApp>
  );
}
