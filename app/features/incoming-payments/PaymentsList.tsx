/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import ru from 'dayjs/locale/ru';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Descriptions, List, Modal, Select } from 'antd';
import { remote } from 'electron';
import { RootState } from '../../store';
import {
  IncomingPayment,
  loadMorePayments,
  removeIncomingPayment,
} from './payments.store';
import { getApiURI } from '../../api/config';

dayjs.extend(localizedFormat);
dayjs.locale(ru);

interface AcceptIncomingPaymentProps {
  id: number;
}

const AcceptIncomingPayment: React.FC<AcceptIncomingPaymentProps> = ({
  id,
}) => {
  const { token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [visible, setVisible] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [selectedWallet, selectWallet] = React.useState(null);
  const acceptIncomingPayment = React.useCallback(
    async (wallet_id) => {
      setLoading(true);
      const response = await fetch(
        `${getApiURI()}/api/v4/accept-incoming-payment/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            incoming_payment: id,
            office_wallet_id: wallet_id,
          }),
        }
      );
      if (response.status === 202) {
        setLoading(false);
        setVisible(false);
        dispatch(removeIncomingPayment(id));
        selectWallet(null);
      } else {
        setLoading(false);
      }
    },
    [id, token]
  );
  const { wallets } = useSelector((state: RootState) => state.wallets);
  return (
    <>
      <a
        key="list-loadmore-edit"
        href=""
        onClick={(e) => {
          e.preventDefault();
          setVisible(true);
        }}
      >
        Подтвердить
      </a>
      <Modal
        title="Внесение платежа на счет"
        visible={visible}
        onOk={() => acceptIncomingPayment(selectedWallet)}
        confirmLoading={loading}
        onCancel={() => setVisible(false)}
      >
        <Select
          value={selectedWallet}
          onChange={(v) => selectWallet(v)}
          style={{ width: '100%' }}
        >
          {wallets
            .filter((w) => w.is_active)
            .map((w) => (
              <Select.Option key={w.id} value={w.id}>
                {w.name}
              </Select.Option>
            ))}
        </Select>
      </Modal>
    </>
  );
};

const LoadMore = () => {
  const { loading } = useSelector((state: RootState) => state.payments);
  const dispatch = useDispatch();
  if (loading) return null;
  return (
    <div
      style={{
        textAlign: 'center',
        marginTop: 12,
        marginBottom: 24,
        height: 32,
        lineHeight: '32px',
      }}
    >
      <Button onClick={() => dispatch(loadMorePayments())}>
        Загрузить еще…
      </Button>
    </div>
  );
};

const PaymentsList = () => {
  const {
    loading,
    incoming_payments: { count, results: payments },
  } = useSelector((state: RootState) => state.payments);
  return (
    <List
      loading={loading}
      itemLayout="horizontal"
      loadMore={count > 0 && <LoadMore />}
      dataSource={payments}
      renderItem={(payment: IncomingPayment) => (
        <List.Item
          actions={[<AcceptIncomingPayment key="accept" id={payment.id} />]}
        >
          <List.Item.Meta
            avatar={null}
            title={<h2>{payment.parlor?.name}</h2>}
            description={
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Заметка">
                  {payment.note}
                </Descriptions.Item>
                <Descriptions.Item label="Кто оплатил">
                  {payment.payed_by?.get_full_name}
                </Descriptions.Item>
                {payment.payed_at ? (
                  <Descriptions.Item label="Когда оплатили">
                    {dayjs(payment.payed_at, 'DD.MM.YYYY HH:mm:ss').format(
                      'LLLL'
                    )}
                  </Descriptions.Item>
                ) : null}
                <Descriptions.Item label="Чек">
                  <a
                    href=""
                    onClick={(e) => {
                      e.preventDefault();
                      remote.shell.openExternal(payment.image);
                    }}
                  >
                    Открыть в браузере
                  </a>
                </Descriptions.Item>
              </Descriptions>
            }
          />
          <h2 style={{ margin: 0 }}>{payment.value}</h2>
        </List.Item>
      )}
    />
  );
};

export default PaymentsList;
