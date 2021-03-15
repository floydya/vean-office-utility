/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-nested-ternary */

import { List } from 'antd';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import ActivityDayComponent from '../../components/ActivityDayComponent';

export default function ImpostorList() {
  const { monthRange, activities } = useSelector((state: RootState) => state.impostor);
  return (
    <List
      itemLayout="horizontal"
      dataSource={monthRange}
      renderItem={(date) => <ActivityDayComponent date={date} activities={activities} />}
    />
  );
}
