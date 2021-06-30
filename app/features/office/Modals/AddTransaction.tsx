/* eslint-disable react/jsx-curly-newline */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import { Form, Input, InputNumber, Modal } from 'antd';
import { MinusSquareTwoTone, PlusSquareTwoTone } from '@ant-design/icons';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getApiURI } from '../../../api/config';
import { RootState } from '../../../store';
import { fetchWallet } from '../office.store';

const useTransaction = (
  wallet_id: number,
  negative: boolean,
  setVisible: (v: boolean) => never
) => {
  const { token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const addTransaction = React.useCallback(
    async (values: any, resetFields) => {
      try {
        const response = await fetch(
          `${getApiURI()}/api/v4/transactions/create/`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              ...values,
              amount: negative ? values.amount * -1 : values.amount,
              purpose: wallet_id,
            }),
          }
        );
        console.log(response);
        resetFields();
        dispatch(fetchWallet(null));
        setVisible(false);
      } catch (err) {
        console.log(err);
      }
    },
    [wallet_id, token]
  );
  return addTransaction;
};

const BasicFormComponent = ({
  wallet_id,
  Component,
  componentProps,
  title,
  negative,
}) => {
  const [visible, setVisible] = React.useState(false);
  const [form] = Form.useForm();
  const addTransaction = useTransaction(wallet_id, negative, setVisible);
  return (
    <>
      <Component
        style={{ fontSize: '32px' }}
        onClick={() => setVisible(true)}
        {...componentProps}
      />
      <Modal
        title={title}
        visible={visible}
        onOk={() =>
          form
            .validateFields()
            .then((values) => addTransaction(values, form.resetFields))
        }
        okText="Добавить"
        cancelText="Закрыть"
        onCancel={() => setVisible(false)}
      >
        <Form form={form} layout="vertical" name="modalform">
          <Form.Item name="amount" required>
            <InputNumber
              placeholder="Сумма"
              min={0.01}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item name="reference" required>
            <Input placeholder="Комментарий" />
          </Form.Item>
          {/* <Form.Item name="attachment">
          </Form.Item> */}
        </Form>
      </Modal>
    </>
  );
};

export const PlusCash = ({ wallet_id }) => {
  return (
    <BasicFormComponent
      wallet_id={wallet_id}
      title="Добавление дохода на баланс"
      Component={PlusSquareTwoTone}
      componentProps={{}}
      negative={false}
    />
  );
};

export const MinusCash = ({ wallet_id }) => {
  return (
    <BasicFormComponent
      wallet_id={wallet_id}
      title="Добавление расхода на баланс"
      Component={MinusSquareTwoTone}
      componentProps={{ twoToneColor: '#ce0b0b' }}
      negative
    />
  );
};
