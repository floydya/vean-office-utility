/* eslint-disable react-hooks/exhaustive-deps */
import { Collapse } from 'antd';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LayoutApp from '../../containers/Layout';
import { RootState } from '../../store';
import { fetchActivities } from './impostor.store';
import ImpostorHeaderFilter from './ImpostorHeaderFilter';
import ImpostorList from './ImpostorList';
import MonthStatistic from './MonthStatistic';

export default function ImpostorComponent() {
  const { employee, month, year, loading } = useSelector(
    (state: RootState) => state.impostor
  );
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(fetchActivities());
  }, [employee, month, year]);
  return (
    <LayoutApp>
      <ImpostorHeaderFilter />
      <MonthStatistic />
      {!loading && (
        <Collapse>
          <Collapse.Panel header="Подробнее по каждому дню" key="1">
            <ImpostorList />
          </Collapse.Panel>
        </Collapse>
      )}
    </LayoutApp>
  );
}
