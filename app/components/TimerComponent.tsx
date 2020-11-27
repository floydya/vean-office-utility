/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Form, Statistic, TimePicker } from 'antd';
import { remote } from 'electron';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  toggleActivity,
  tick as _Tick,
  finishLastDay,
  setFinishedTime,
} from '../features/home/home.store';
import { RootState } from '../store';
import secondsToHms from '../utils/seconds';

interface Props {
  direction: 'column' | 'row';
}

function CurrentTimerComponent({ direction }: Props) {
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
        justifyContent: direction === 'column' ? 'center' : 'space-between',
        alignItems: (direction === 'column' && 'center') as string,
        height: (direction === 'column' && 'calc(100vh - 64px)') as string,
        flexDirection: direction,
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

function NotFinishedTimerComponent({ direction }: Props) {
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
      <h1>{new Date(notFinished.date).toLocaleDateString()}</h1>
      <Form form={form} onFinish={() => dispatch(finishLastDay())}>
        <Form.Item
          name="end_at"
          validateStatus={Object.keys(error || {}).length > 0 ? 'error' : null}
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

export default function TimerComponent({ direction }: Props) {
  const { notFinished } = useSelector((state: RootState) => state.activity);
  if (notFinished) return <NotFinishedTimerComponent direction={direction} />;
  return <CurrentTimerComponent direction={direction} />;
}
