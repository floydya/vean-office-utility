/* eslint-disable @typescript-eslint/naming-convention */
import { Col, Row, Statistic } from 'antd';
import dayjs from 'dayjs';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import secondsToHms from '../../utils/seconds';

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

export default function MonthStatistic() {
  const { activities, monthRange } = useSelector(
    (state: RootState) => state.activities
  );
  const { salary, hours_per_day } = useSelector(
    (state: RootState) => state.settings
  );
  const time = activities.reduce((acc, next) => acc + next.spent_time, 0);
  const [gainedSalary, neededTime] = countSalary(
    parseInt(salary as string, 10),
    parseInt(hours_per_day as string, 10),
    monthRange,
    time
  );
  return (
    <Row gutter={16} style={{ margin: '16px 0' }}>
      <Col span={8}>
        <Statistic
          style={{ textAlign: 'center' }}
          title="Часов отработано"
          value={secondsToHms(time)}
        />
      </Col>
      <Col span={8}>
        <Statistic
          style={{ textAlign: 'center' }}
          title="Часов необходимо"
          value={secondsToHms(neededTime)}
        />
      </Col>
      <Col span={8}>
        <Statistic
          style={{ textAlign: 'center' }}
          title="Зарплата"
          value={gainedSalary.toFixed(2)}
        />
      </Col>
    </Row>
  );
}
