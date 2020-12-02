/* eslint-disable @typescript-eslint/naming-convention */
import { Button, Form, InputNumber, Typography } from 'antd';
import { machineIdSync } from 'node-machine-id';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { RootState } from '../../store';
import { resetAuthentication } from '../login/login.store';
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
        label="Ставка"
        initialValue={salary}
        extra="Укажите вашу ставку за месяц."
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
        extra="Укажите количество часов, которые нужно отработать за день."
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
      <Form.Item
        labelAlign="left"
        label="Токен авторизации"
        extra="Этот токен нужен для активации таймера в отсутствие интернета."
      >
        <Typography.Paragraph copyable ellipsis style={{ marginBottom: 0 }}>
          {machineIdSync()}
        </Typography.Paragraph>
      </Form.Item>
      {!configuration && (
        <Form.Item
          labelAlign="left"
          label="Сброс авторизации"
          extra="Если возникли проблемы с авторизацией или нужно перезайти на другой аккаунт - жмём сюда."
        >
          <Button
            style={{ width: '100%' }}
            htmlType="button"
            type="ghost"
            onClick={() => dispatch(resetAuthentication())}
          >
            Сбросить
          </Button>
        </Form.Item>
      )}
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
