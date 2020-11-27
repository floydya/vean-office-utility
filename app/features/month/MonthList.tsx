/* eslint-disable react/prop-types */
import { List } from 'antd';
import * as React from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { RootState } from '../../store';
import secondsToHms from '../../utils/seconds';

interface ActivityDayProps {
  date: string;
}

const ActivityDayComponent: React.FC<ActivityDayProps> = ({ date }) => {
  const { activities } = useSelector((state: RootState) => state.activities);
  const selectedDate = activities.find(
    (el) =>
      dayjs(el.date).format('YYYY-MM-DD') === dayjs(date).format('YYYY-MM-DD')
  );
  const isWeekend = !(dayjs(date).day() < 6 && dayjs(date).day() > 0);
  const time = selectedDate
    ? selectedDate.logs
        .find((el) => el.action === 'start')
        .created_at.split(' ')[1]
    : null;
  return (
    <List.Item
      extra={selectedDate ? secondsToHms(selectedDate.spent_time) : null}
      style={{ backgroundColor: isWeekend ? 'rgba(255,255,255,0.175)' : null }}
    >
      <List.Item.Meta
        title={`${dayjs(date).format('DD.MM.YYYY')}${
          [0, 6].includes(dayjs(date).day()) ? ' – выходной' : ''
        }`}
        description={time ? `Время запуска таймера: ${time}` : null}
      />
    </List.Item>
  );
};

export default function MonthList() {
  const { monthRange } = useSelector((state: RootState) => state.activities);
  return (
    <List
      itemLayout="horizontal"
      dataSource={monthRange}
      renderItem={(date) => <ActivityDayComponent date={date} />}
    />
  );
}
