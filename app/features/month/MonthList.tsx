/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-nested-ternary */

import { Button, List, Modal, Timeline } from 'antd';
import * as React from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { RootState } from '../../store';
import secondsToHms from '../../utils/seconds';
import style from './MonthList.module.css';

dayjs.extend(customParseFormat);

interface ActivityDayProps {
  date: string;
}

const ActivityDayComponent: React.FC<ActivityDayProps> = ({ date }) => {
  const { activities } = useSelector((state: RootState) => state.activities);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
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
    <>
      <List.Item
        className={
          selectedDate?.logs?.length
            ? `${style.listItemHover} ${style.listItem}`
            : style.listItem
        }
        extra={selectedDate ? secondsToHms(selectedDate.spent_time) : null}
        style={{
          backgroundColor: isWeekend ? 'rgba(255,255,255,0.175)' : null,
        }}
        onClick={setIsModalVisible.bind(null, true)}
      >
        <List.Item.Meta
          title={`${dayjs(date).format('DD.MM.YYYY')}${
            [0, 6].includes(dayjs(date).day()) ? ' – выходной' : ''
          }`}
          description={time ? `Время запуска таймера: ${time}` : null}
        />
      </List.Item>
      {selectedDate?.logs?.length > 0 && (
        <Modal
          title={dayjs(date).format('DD.MM.YYYY')}
          visible={isModalVisible}
          onOk={setIsModalVisible.bind(null, false)}
          onCancel={setIsModalVisible.bind(null, false)}
          footer={[
            <Button key="submit" onClick={setIsModalVisible.bind(null, false)}>
              Закрыть
            </Button>,
          ]}
        >
          <Timeline mode="right">
            {selectedDate.logs.map((log) => (
              <Timeline.Item
                key={`log-${log.created_at}`}
                color={
                  log.action === 'start'
                    ? 'green'
                    : log.action === 'resume'
                    ? 'blue'
                    : 'red'
                }
                label={
                  log.action === 'start'
                    ? 'Запущен'
                    : log.action === 'resume'
                    ? 'Снят с паузы'
                    : 'Поставлен на паузу'
                }
              >
                {dayjs(log.created_at, 'DD.MM.YYYY HH:mm:ss').format(
                  'HH:mm:ss'
                )}
              </Timeline.Item>
            ))}
          </Timeline>
        </Modal>
      )}
    </>
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
