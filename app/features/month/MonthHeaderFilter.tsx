import { Form, Alert, Select, Row, Col, PageHeader } from 'antd';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActivities, setMonth, setYear } from './month.store';
import { RootState } from '../../store';

const Filter = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { month, year } = useSelector((state: RootState) => state.activities);
  const { loading, errors } = useSelector(
    (state: RootState) => state.activities
  );
  return (
    <Form
      form={form}
      onFinish={() => dispatch(fetchActivities())}
      layout="inline"
      style={{ marginBottom: '32px' }}
    >
      {errors?.non_field_errors && (
        <Alert
          message="Ошибка"
          description={errors.non_field_errors}
          type="error"
          showIcon
          style={{ marginBottom: '0.5em' }}
        />
      )}
      <Row style={{ width: '100%' }}>
        <Col span={12}>
          <Form.Item
            name="month"
            validateStatus={errors?.month && 'error'}
            help={errors?.month}
            initialValue={month}
            rules={[
              {
                required: true,
                message: 'Это поле обязательное для заполнения!',
              },
            ]}
          >
            <Select
              loading={loading}
              style={{ width: '100%' }}
              onChange={(value) => dispatch(setMonth(value))}
            >
              <Select.Option value="1">Январь</Select.Option>
              <Select.Option value="2">Февраль</Select.Option>
              <Select.Option value="3">Март</Select.Option>
              <Select.Option value="4">Апрель</Select.Option>
              <Select.Option value="5">Март</Select.Option>
              <Select.Option value="6">Июнь</Select.Option>
              <Select.Option value="7">Июль</Select.Option>
              <Select.Option value="8">Август</Select.Option>
              <Select.Option value="9">Сентябрь</Select.Option>
              <Select.Option value="10">Октябрь</Select.Option>
              <Select.Option value="11">Ноябрь</Select.Option>
              <Select.Option value="12">Декабрь</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="year"
            validateStatus={errors?.year && 'error'}
            help={errors?.year}
            initialValue={year}
            rules={[
              {
                required: true,
                message: 'Это поле обязательное для заполнения!',
              },
            ]}
          >
            <Select
              loading={loading}
              style={{ width: '100%' }}
              onChange={(value) => dispatch(setYear(value))}
            >
              <Select.Option value="2019">2019</Select.Option>
              <Select.Option value="2020">2020</Select.Option>
              <Select.Option value="2021">2021</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default function MonthHeaderFilter() {
  return <PageHeader title={null} footer={<Filter />} />;
}
