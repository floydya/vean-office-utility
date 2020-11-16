import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser, selectUser } from '../login/login.store';
import LayoutApp from '../../containers/Layout';
import { fetchActivity } from './home.store';
import TimerComponent from '../../components/TimerComponent';

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
      <TimerComponent direction="column" />
    </LayoutApp>
  );
}
