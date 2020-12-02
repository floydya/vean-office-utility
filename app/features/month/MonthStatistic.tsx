/* eslint-disable @typescript-eslint/naming-convention */
import { Card, Col, Progress, Row, Statistic, Tooltip } from 'antd';
import dayjs from 'dayjs';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ClockCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { RootState } from '../../store';
import secondsToHms from '../../utils/seconds';
import { fetchActivities } from './month.store';
import classes from './MonthStatistic.module.css';

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
  const { activities, monthRange, loading } = useSelector(
    (state: RootState) => state.activities
  );
  const { salary, hours_per_day } = useSelector(
    (state: RootState) => state.settings
  );
  const dispatch = useDispatch();
  const time = activities.reduce(
    (acc, next: ActivityType) => acc + next.spent_time,
    0
  );
  const [gainedSalary, neededTime] = countSalary(
    parseInt(salary as string, 10),
    parseInt(hours_per_day as string, 10),
    monthRange,
    time
  );
  return (
    <Card
      style={{ marginBottom: '32px' }}
      actions={[
        <HoursTooltip key="hours" time={time} neededTime={neededTime} />,
      ]}
    >
      <Row gutter={16} style={{ margin: '16px 0' }}>
        <Col span={11}>
          <Statistic
            loading={loading}
            prefix={<ClockCircleOutlined />}
            style={{ textAlign: 'center' }}
            title="Часов отработано"
            value={secondsToHms(time, false)}
          />
        </Col>
        <Col span={11}>
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
            suffix={` / ${salary}`}
          />
        </Col>
        <Col span={2}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <ReloadOutlined
              className={classes.refresh}
              onClick={() => dispatch(fetchActivities())}
            />
          </div>
        </Col>
      </Row>
    </Card>
  );
}
