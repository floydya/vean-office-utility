/* eslint-disable @typescript-eslint/naming-convention */
import { Button, Form, InputNumber } from 'antd';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { RootState } from '../../store';
import { setHoursPerDay, setSalary } from './settings.store';

const salaryFormatter = (value: string | number | undefined) =>
  `₴ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

interface SettingsProps {
  configuration?: boolean;
}

const SettingsComponent: React.FC<SettingsProps> = ({
  // eslint-disable-next-line react/prop-types
  configuration = false,
}) => {
  const dispatch = useDispatch();
  const { salary, hours_per_day } = useSelector(
    (state: RootState) => state.settings
  );
  const history = useHistory();
  return (
    <Form
      style={{ marginTop: '32px', padding: '8px 32px' }}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      onFinish={() => history.push('/')}
    >
      <Form.Item
        labelAlign="left"
        name="salary"
        label="Ставка за месяц"
        initialValue={salary}
        rules={[
          {
            required: true,
            message: 'Это поле обязательное для заполнения!',
          },
        ]}
      >
        <InputNumber
          style={{ width: '100%' }}
          formatter={salaryFormatter}
          parser={(value) => value.replace(/₴\s?|(,*)/g, '')}
          onChange={(value) => dispatch(setSalary(value))}
        />
      </Form.Item>
      <Form.Item
        labelAlign="left"
        name="hours_per_day"
        label="Часов в день"
        initialValue={hours_per_day}
        rules={[
          {
            required: true,
            message: 'Это поле обязательное для заполнения!',
          },
        ]}
      >
        <InputNumber
          // prefix={<ClockCircleOutlined />}
          style={{ width: '100%' }}
          onChange={(value) => dispatch(setHoursPerDay(value))}
        />
      </Form.Item>
      {configuration && (
        <Form.Item wrapperCol={{ span: 24 }} style={{ textAlign: 'center' }}>
          <Button htmlType="submit" type="primary">
            Продолжить
          </Button>
        </Form.Item>
      )}
    </Form>
  );
};

export default SettingsComponent;
