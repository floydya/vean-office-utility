/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Input, Modal } from 'antd';
import React from 'react';
import { useDispatch } from 'react-redux';
import { PlusOutlined } from '@ant-design/icons';
import { createWallet } from './office.store';

interface Props {
  className: string;
}

const WalletAddModal: React.FC<Props> = ({ className }) => {
  const dispatch = useDispatch();
  const [visible, setVisible] = React.useState(false);
  const showModal = React.useCallback(() => setVisible(true), []);
  const hideModal = React.useCallback(() => setVisible(false), []);
  const [loading, setLoading] = React.useState(false);
  const [name, setName] = React.useState('');
  const handleCreate = React.useCallback((newName) => {
    setLoading(true);
    dispatch(createWallet(newName));
    setLoading(false);
    hideModal();
  }, []);
  return (
    <>
      <PlusOutlined
        className={className}
        onClick={showModal}
        role="button"
        tabIndex={0}
      />
      <Modal
        title="Создание нового офисного счета"
        visible={visible}
        onOk={() => handleCreate(name)}
        okText="Создать"
        cancelText="Закрыть"
        confirmLoading={loading}
        onCancel={hideModal}
      >
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Название счета"
          required
        />
      </Modal>
    </>
  );
};

export default WalletAddModal;
