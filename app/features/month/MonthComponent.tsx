/* eslint-disable react-hooks/exhaustive-deps */
import { Collapse } from 'antd';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LayoutApp from '../../containers/Layout';
import { RootState } from '../../store';
import { fetchActivities } from './month.store';
import MonthHeaderFilter from './MonthHeaderFilter';
import MonthList from './MonthList';
import MonthStatistic from './MonthStatistic';

export default function MonthComponent() {
  const { month, year, loading } = useSelector(
    (state: RootState) => state.activities
  );
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(fetchActivities());
  }, []);
  React.useEffect(() => {
    dispatch(fetchActivities());
  }, [month, year]);
  return (
    <LayoutApp>
      <MonthHeaderFilter />
      <MonthStatistic />
      {!loading && (
        <Collapse>
          <Collapse.Panel header="Подробнее по каждому дню" key="1">
            <MonthList />
          </Collapse.Panel>
        </Collapse>
      )}
    </LayoutApp>
  );
}
