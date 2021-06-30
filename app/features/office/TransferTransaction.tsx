/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Button, Modal, Select } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getApiURI } from '../../api/config';
import { RootState } from '../../store';
import { fetchWallets, removeTransaction } from './office.store';

interface TransferTransactionProps {
  id: number;
  currentWallet: number;
}

const TransferTransaction: React.FC<TransferTransactionProps> = ({
  id,
  currentWallet,
}) => {
  const { token } = useSelector((state: RootState) => state.auth);
  const { wallets } = useSelector((state: RootState) => state.wallets);
  const dispatch = useDispatch();
  const [selectedWallet, selectWallet] = React.useState(null);
  const [visible, setVisible] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const handleTransfer = React.useCallback(
    async (wallet_id) => {
      setLoading(true);
      const response = await fetch(
        `${getApiURI()}/api/v4/transactions/${id}/transfer_to/${wallet_id}/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 202) {
        setLoading(false);
        setVisible(false);
        dispatch(removeTransaction(id));
        dispatch(fetchWallets());
        selectWallet(null);
      } else {
        setLoading(false);
      }
    },
    [id, token]
  );
  return (
    <>
      <Button
        loading={loading}
        onClick={() => setVisible(true)}
        style={{ width: '100%' }}
      >
        Перенести
      </Button>
      <Modal
        title="Перенос транзакции на другой счет"
        visible={visible}
        onOk={() => handleTransfer(selectedWallet)}
        okText="Создать"
        cancelText="Закрыть"
        confirmLoading={loading}
        onCancel={() => setVisible(false)}
      >
        <Select
          value={selectedWallet}
          onChange={(v) => selectWallet(v)}
          style={{ width: '100%' }}
        >
          {wallets
            .filter((w) => w.is_active && w.id !== currentWallet)
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

export default TransferTransaction;
