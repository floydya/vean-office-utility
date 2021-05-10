/* eslint-disable @typescript-eslint/naming-convention */
import { remote } from 'electron';
import { Button, Col, Row } from 'antd';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { buildURI } from '../../api/config';
import {
  countNeededTime,
  countSalary,
  HoursTooltip,
  MonthStatisticComponent,
} from '../month/MonthStatistic';

export default function MonthStatistic() {
  const {
    activities,
    monthRange,
    loading,
    salary,
    hoursPerDay,
    month,
    year,
    employee,
  } = useSelector((state: RootState) => state.impostor);
  const time = activities.reduce(
    (acc, next: ActivityType) => acc + next.spent_time,
    0
  );
  const [timeToWork, timeToWorkHMS] = countNeededTime(
    parseInt(hoursPerDay as string, 10),
    monthRange,
    time
  );
  const [gainedSalary, neededTime, perHour] = countSalary(
    parseInt(salary as string, 10),
    parseInt(hoursPerDay as string, 10),
    monthRange,
    time
  );
  const printDocs = React.useCallback(async () => {
    const url = buildURI(
      `/api/v1/activity/office/activity/?employee=${employee}&month=${month}&year=${year}&salary=${salary}&hours_per_day=${hoursPerDay}`
    );
    await remote.shell.openExternal(url);
  }, [salary, hoursPerDay, employee, month, year]);
  return (
    <MonthStatisticComponent
      footerComponents={[
        <Row key="print">
          <Col span={18}>
            <HoursTooltip key="hours" time={time} neededTime={neededTime} />
          </Col>
          <Col span={6}>
            <Button danger type="primary" onClick={printDocs}>
              Распечатать
            </Button>
          </Col>
        </Row>,
      ]}
      time={time}
      loading={loading}
      timeToWork={timeToWork}
      timeToWorkHMS={timeToWorkHMS}
      gainedSalary={gainedSalary}
      salary={salary}
      perHour={perHour}
    />
  );
  // return (
  //   <Card
  //     style={{ marginBottom: '32px' }}
  //     actions={[
  //       <Row key="print">
  //         <Col span={18}>
  //           <HoursTooltip key="hours" time={time} neededTime={neededTime} />
  //         </Col>
  //         <Col span={6}>
  //           <Button danger type="primary" onClick={printDocs}>
  //             Распечатать
  //           </Button>
  //         </Col>
  //       </Row>,
  //     ]}
  //   >
  //     <Row gutter={16} style={{ margin: '16px 0' }}>
  //       <Col span={6}>
  //         <Statistic
  //           loading={loading}
  //           prefix={<ClockCircleOutlined />}
  //           style={{ textAlign: 'center' }}
  //           title="Часов отработано"
  //           value={secondsToHms(time, false)}
  //         />
  //       </Col>
  //       <Col span={6}>
  //         <Statistic
  //           loading={loading}
  //           style={{ textAlign: 'center' }}
  //           title={timeToWork < 0 ? 'Переработано' : 'Нужно доработать'}
  //           value={timeToWorkHMS}
  //           prefix={<ClockCircleOutlined />}
  //           valueStyle={{
  //             color: timeToWork > 0 ? 'red' : 'green',
  //           }}
  //         />
  //       </Col>
  //       <Col span={6}>
  //         <Statistic
  //           loading={loading}
  //           style={{ textAlign: 'center' }}
  //           title="Зарплата"
  //           value={gainedSalary.toFixed(2)}
  //           prefix="₴"
  //           valueStyle={{
  //             color:
  //               gainedSalary > parseFloat(salary as string)
  //                 ? 'green'
  //                 : undefined,
  //           }}
  //         />
  //       </Col>
  //       <Col span={6}>
  //         <Statistic
  //           loading={loading}
  //           style={{ textAlign: 'center' }}
  //           title="Зарплата в час"
  //           value={(
  //             parseFloat(salary) / parseFloat(hoursToWork as string)
  //           ).toFixed(2)}
  //           prefix="₴"
  //         />
  //       </Col>
  //     </Row>
  //   </Card>
  // );
}
