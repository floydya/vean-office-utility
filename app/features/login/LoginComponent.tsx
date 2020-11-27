/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Button, Form, Input, Layout } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {
  authenticate,
  selectErrors,
  selectLoading,
  setPassword,
  setUsername,
} from './login.store';
import { RootState } from '../../store';

export default function LoginComponent() {
  const dispatch = useDispatch();
  const { username, password } = useSelector((state: RootState) => state.auth);
  const errors = useSelector(selectErrors);
  const loading = useSelector(selectLoading);
  const [form] = Form.useForm();
  React.useEffect(() => {
    if (username && password) {
      dispatch(authenticate());
    }
  }, []);
  return (
    <Layout>
      <Layout.Content>
        <div
          style={{
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
          }}
        >
          <Form form={form} onFinish={() => dispatch(authenticate())}>
            <h1>Авторизация</h1>
            {errors?.non_field_errors && (
              <Alert
                message="Ошибка"
                description={errors.non_field_errors}
                type="error"
                showIcon
                style={{ marginBottom: '0.5em' }}
              />
            )}
            <Form.Item
              name="username"
              validateStatus={errors?.username && 'error'}
              help={errors?.username}
              initialValue={username}
              rules={[
                {
                  required: true,
                  message: 'Это поле обязательное для заполнения!',
                },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Логин"
                onChange={(e) => dispatch(setUsername(e.target.value))}
              />
            </Form.Item>
            <Form.Item
              name="password"
              validateStatus={errors?.password && 'error'}
              help={errors?.password}
              initialValue={password}
              rules={[
                {
                  required: true,
                  message: 'Это поле обязательное для заполнения!',
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Пароль"
                onChange={(e) => dispatch(setPassword(e.target.value))}
              />
            </Form.Item>
            <Form.Item style={{ textAlign: 'center' }}>
              <Button
                type="primary"
                htmlType="submit"
                onSubmit={() => dispatch(authenticate())}
                loading={loading}
              >
                Войти
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Layout.Content>
    </Layout>
  );
}
