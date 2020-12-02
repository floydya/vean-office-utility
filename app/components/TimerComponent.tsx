/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import {
  Button,
  Card,
  Form,
  Statistic,
  Timeline,
  TimePicker,
  Typography,
} from 'antd';
import { remote } from 'electron';
import { useDispatch, useSelector } from 'react-redux';
import {
  toggleActivity,
  tick as _Tick,
  finishLastDay,
  setFinishedTime,
} from '../features/home/home.store';
import { RootState } from '../store';
import secondsToHms from '../utils/seconds';

function CurrentTimerComponent() {
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
    <Card
      actions={[
        <div
          role="button"
          tabIndex={0}
          key="timer"
          onClick={() => dispatch(toggleActivity())}
          onKeyDown={() => dispatch(toggleActivity())}
        >
          <Typography.Title
            level={3}
            type={status ? 'danger' : 'success'}
            style={{ marginBottom: '0' }}
          >
            {status ? 'Пауза' : 'Начать'}
          </Typography.Title>
        </div>,
      ]}
    >
      <Statistic
        title="Таймер"
        value={secondsToHms(currentTime)}
        style={{ textAlign: 'center' }}
      />
    </Card>
  );
}

function NotFinishedTimerComponent({
  direction,
}: {
  direction: 'row' | 'column';
}) {
  const { notFinished, loading, error } = useSelector(
    (state: RootState) => state.activity
  );
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: direction === 'column' ? 'center' : 'space-between',
        alignItems: (direction === 'column' && 'center') as string,
        height: (direction === 'column' && 'calc(100vh - 64px)') as string,
        flexDirection: 'column',
        textAlign: 'center',
      }}
    >
      <h3>У вас не завершен рабочий день!</h3>
      <h1>{new Date(notFinished?.date as string).toLocaleDateString()}</h1>
      <Form form={form} onFinish={() => dispatch(finishLastDay())}>
        <Form.Item
          name="end_at"
          validateStatus={
            Object.keys(error || {}).length > 0 ? 'error' : undefined
          }
          help={error?.end_at}
          label="Установите время завершения работы"
        >
          <TimePicker
            placeholder="Выберите время..."
            disabledHours={() => [0, 1, 2, 3, 4, 5, 6, 7, 21, 22, 23]}
            format="HH:mm"
            style={{ width: '100%' }}
            onChange={(_, date) => dispatch(setFinishedTime(date))}
          />
        </Form.Item>
        <Form.Item style={{ textAlign: 'center' }}>
          <Button
            loading={loading}
            type="primary"
            htmlType="submit"
            onSubmit={() => dispatch(finishLastDay())}
          >
            Отправить
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

const getLogActionDisplay = (action: string) => {
  switch (action) {
    case 'start':
      return ['green', 'Рабочий день начат'];
    case 'end':
      return ['red', 'Пауза/Стоп'];
    default:
      return ['gray', 'Снят с паузы'];
  }
};

const TodaysTimeline = () => {
  const logs = useSelector((state: RootState) => state.activity.logs);
  if (!logs.length) return null;
  return (
    <>
      <Timeline mode="right">
        {logs.map((log) => (
          <Timeline.Item
            key={log.created_at}
            label={log.created_at}
            color={getLogActionDisplay(log.action)[0]}
          >
            {getLogActionDisplay(log.action)[1]}
          </Timeline.Item>
        ))}
      </Timeline>
    </>
  );
};

export default function TimerComponent({
  direction,
}: {
  direction: 'row' | 'column';
}) {
  const { notFinished } = useSelector((state: RootState) => state.activity);
  if (notFinished) return <NotFinishedTimerComponent direction={direction} />;
  return (
    <>
      <CurrentTimerComponent />
      <TodaysTimeline />
    </>
  );
}
