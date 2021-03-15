import { Select, PageHeader, InputNumber, Descriptions, Button, Modal } from 'antd';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setMonth, setYear, setEmployee, fetchEmployees, setSalary, setHoursPerDay } from './impostor.store';
import { RootState } from '../../store';
import dayjs from 'dayjs';
import ru from 'dayjs/locale/ru';

dayjs.locale(ru);

const groupBy = function(arr, key) {
  return arr.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

const EmployeeSelect = () => {
  const {employee, employees, loading} = useSelector((state: RootState) => state.impostor);
  const currentEmployee = React.useMemo(() => employees.find(el => el.id === employee), [employee, employees]);
  const groupedEmployees = React.useMemo(() => groupBy(employees, "role"), [employees]);
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(fetchEmployees());
  }, []);
  return <>
      <Select
        loading={loading}
        style={{ width: '100%' }}
        labelInValue
        defaultValue={employee ? {value: employee, label: currentEmployee.get_full_name} : undefined}
        onChange={(option) => dispatch(setEmployee(option.value))}
      >
        {Object.entries(groupedEmployees).map(([role, empls]) => (
          <Select.OptGroup label={role}>
            {empls.map(empl => (
              <Select.Option value={empl.id} key={empl.id}>{empl.get_full_name}</Select.Option>
            ))}
          </Select.OptGroup>
        ))}
      </Select>
  </>
}

const MonthSelect = ({formatDay}: {formatDay: dayjs.Dayjs}) => {
  const {month, loading} = useSelector((state: RootState) => state.impostor);
  const dispatch = useDispatch();
  return <>
      <Select
        loading={loading}
        style={{ width: '100%' }}
        labelInValue
        defaultValue={{value: month, label: formatDay.format("MMMM")}}
        onChange={(option) => dispatch(setMonth(option.value))}
      >
        <Select.Option value="1">Январь</Select.Option>
        <Select.Option value="2">Февраль</Select.Option>
        <Select.Option value="3">Март</Select.Option>
        <Select.Option value="4">Апрель</Select.Option>
        <Select.Option value="5">Май</Select.Option>
        <Select.Option value="6">Июнь</Select.Option>
        <Select.Option value="7">Июль</Select.Option>
        <Select.Option value="8">Август</Select.Option>
        <Select.Option value="9">Сентябрь</Select.Option>
        <Select.Option value="10">Октябрь</Select.Option>
        <Select.Option value="11">Ноябрь</Select.Option>
        <Select.Option value="12">Декабрь</Select.Option>
      </Select>
  </>
}

const YearSelect = ({formatDay}: {formatDay: dayjs.Dayjs}) => {
  const {year, loading} = useSelector((state: RootState) => state.impostor);
  const dispatch = useDispatch();
  return <>
      <Select
        loading={loading}
        style={{ width: '100%' }}
        value={year}
        onChange={(value) => dispatch(setYear(value))}
      >
        <Select.Option value="2019">2019</Select.Option>
        <Select.Option value="2020">2020</Select.Option>
        <Select.Option value="2021">2021</Select.Option>
        <Select.Option value="2022">2022</Select.Option>
      </Select>
  </>
}

export default function MonthHeaderFilter() {
  const {
    month, year, salary, hoursPerDay
  } = useSelector((state: RootState) => state.impostor);
  const dispatch = useDispatch();
  const formatDay = React.useMemo(() => dayjs(`${year}-${month}-01`), [year, month]);
  return <PageHeader title={null}>
    <Descriptions labelStyle={{alignItems: "center", width: '100px'}} contentStyle={{alignItems: "center", padding: "0 10px"}} size="small" column={2}>
      <Descriptions.Item span={2} label="Сотрудник">
        <EmployeeSelect />
      </Descriptions.Item>
      <Descriptions.Item label="Месяц" style={{ textTransform: "capitalize" }}>
        <MonthSelect formatDay={formatDay} />
      </Descriptions.Item>
      <Descriptions.Item label="Год">
        <YearSelect formatDay={formatDay} />
      </Descriptions.Item>
      <Descriptions.Item label="Ставка">
        <InputNumber style={{ width: '100%' }} value={salary ? salary : undefined} onChange={(value) => dispatch(setSalary(value))} />
      </Descriptions.Item>
      <Descriptions.Item label="Часов в день">
        <InputNumber style={{ width: '100%' }} value={hoursPerDay ? hoursPerDay : undefined} onChange={(value) => dispatch(setHoursPerDay(value))} />
      </Descriptions.Item>
    </Descriptions>
  </PageHeader>;
}
