/* eslint-disable @typescript-eslint/naming-convention */
import { remote } from 'electron';
import { Button, Card, Col, Progress, Row, Statistic, Tooltip } from 'antd';
import dayjs from 'dayjs';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { ClockCircleOutlined } from '@ant-design/icons';
import { RootState } from '../../store';
import secondsToHms from '../../utils/seconds';
import { buildURI, getFetchConfiguration } from '../../api/config';

const countSalary = (
  salary: number,
  hours_per_day: number,
  monthRange: string[],
  time: number
) => {
  const workDays = monthRange.filter((el: string) => {
    const weekDay = dayjs(el).day();
    return weekDay > 0 && weekDay < 6;
  });
  const neededHours = workDays.length * hours_per_day;
  const salary_per_hour = salary / neededHours;
  const salary_per_second = salary_per_hour / 60 / 60;
  return [salary_per_second * time, neededHours * 60 * 60];
};

const countNeededTime = (
  hours_per_day: number,
  monthRange: string[],
  time: number
) => {
  const workDays = monthRange.filter((el: string) => {
    const date = dayjs(el);
    const weekDay = date.day();
    if (date.diff(dayjs()) < 0) return weekDay > 0 && weekDay < 6;
    return false;
  });
  const timeToWork = workDays.length * hours_per_day * 60 * 60 - time;
  return [timeToWork, secondsToHms(Math.abs(timeToWork)), workDays.length * hours_per_day];
};

interface HoursProps {
  time: number;
  neededTime: number;
}

const HoursTooltip = ({ time, neededTime }: HoursProps) => {
  const percent = parseInt(((time / neededTime) * 100).toFixed(0), 10);
  return (
    <Tooltip
      title={`Нужно отработать ${secondsToHms(
        neededTime,
        true
      )} часов в этом месяце.`}
    >
      <Progress
        style={{ padding: '5px 15px' }}
        percent={percent}
        status={percent >= 100 ? 'success' : 'active'}
      />
    </Tooltip>
  );
};

export default function MonthStatistic() {
  const { activities, monthRange, loading, salary, hoursPerDay, month, year, employee } = useSelector(
    (state: RootState) => state.impostor
  );
  const time = activities.reduce(
    (acc, next: ActivityType) => acc + next.spent_time,
    0
  );
  const [timeToWork, timeToWorkHMS, hoursToWork] = countNeededTime(
    parseInt(hoursPerDay as string, 10),
    monthRange,
    time
  );
  const [gainedSalary, neededTime] = countSalary(
    parseInt(salary as string, 10),
    parseInt(hoursPerDay as string, 10),
    monthRange,
    time
  );
  const printDocs = React.useCallback(async () => {
    const url = buildURI(`/api/v1/activity/office/activity/?employee=${employee}&month=${month}&year=${year}&salary=${salary}&hours_per_day=${hoursPerDay}`);
    remote.shell.openExternal(url);
  }, [salary, hoursPerDay, employee, month, year]);
  return (
    <Card
      style={{ marginBottom: '32px' }}
      actions={[
        <Row>
          <Col span={18}>
            <HoursTooltip key="hours" time={time} neededTime={neededTime} />
          </Col>
          <Col span={6}>
            <Button danger type="primary" onClick={printDocs}>Распечатать</Button>
          </Col>
        </Row>,
      ]}
    >
      <Row gutter={16} style={{ margin: '16px 0' }}>
        <Col span={6}>
          <Statistic
            loading={loading}
            prefix={<ClockCircleOutlined />}
            style={{ textAlign: 'center' }}
            title="Часов отработано"
            value={secondsToHms(time, false)}
          />
        </Col>
        <Col span={6}>
          <Statistic
            loading={loading}
            style={{ textAlign: 'center' }}
            title={timeToWork < 0 ? 'Переработано' : 'Нужно доработать'}
            value={timeToWorkHMS}
            prefix={<ClockCircleOutlined />}
            valueStyle={{
              color: timeToWork > 0 ? 'red' : 'green',
            }}
          />
        </Col>
        <Col span={6}>
          <Statistic
            loading={loading}
            style={{ textAlign: 'center' }}
            title="Зарплата"
            value={gainedSalary.toFixed(2)}
            prefix="₴"
            valueStyle={{
              color:
                gainedSalary > parseFloat(salary as string)
                  ? 'green'
                  : undefined,
            }}
          />
        </Col>
        <Col span={6}>
          <Statistic
            loading={loading}
            style={{ textAlign: 'center' }}
            title="Зарплата в час"
            value={(parseFloat(salary) / parseFloat(hoursToWork as string)).toFixed(2)}
            prefix="₴"
          />
        </Col>
      </Row>
    </Card>
  );
}
