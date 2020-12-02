/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import LayoutApp from '../../containers/Layout';
import TimerComponent from '../../components/TimerComponent';

export default function HomeComponent() {
  return (
    <LayoutApp>
      <TimerComponent direction="column" />
    </LayoutApp>
  );
}
