import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWallet, fetchWallets } from '../features/office/office.store';
import WalletLogs from '../features/office/WalletLogs';
import WalletSelector from '../features/office/WalletSelector';
import { RootState } from '../store';
import LayoutApp from './Layout';

const WalletsPage = () => {
  const dispatch = useDispatch();
  const currentWallet = useSelector(
    (state: RootState) => state.wallets.currentWallet
  );
  React.useEffect(() => {
    dispatch(fetchWallets());
  }, []);
  React.useEffect(() => {
    if (currentWallet) {
      dispatch(fetchWallet(currentWallet));
    }
  }, [currentWallet]);
  return (
    <LayoutApp contentStyle={{ height: '100%' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          height: '100%',
        }}
      >
        <WalletSelector />
        <WalletLogs />
      </div>
    </LayoutApp>
  );
};

export default WalletsPage;
