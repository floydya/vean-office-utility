import React from 'react';
import { useDispatch } from 'react-redux';
import { fetchIncomingPayments } from '../features/incoming-payments/payments.store';
import PaymentsList from '../features/incoming-payments/PaymentsList';
import { fetchWallets } from '../features/office/office.store';
import LayoutApp from './Layout';

const WalletsPage = () => {
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(fetchIncomingPayments());
    dispatch(fetchWallets());
  }, []);
  return (
    <LayoutApp>
      <PaymentsList />
    </LayoutApp>
  );
};

export default WalletsPage;
