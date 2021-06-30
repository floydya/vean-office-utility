/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classnames from 'classnames';
import { ReloadOutlined } from '@ant-design/icons';
import { RootState } from '../../store';
import classes from './WalletSelector.module.css';
import WalletAddModal from './WalletAddModal';
import { setCurrentWallet, fetchWallets } from './office.store';

const WalletSelector: React.FC = () => {
  const { wallets, currentWallet } = useSelector(
    (state: RootState) => state.wallets
  );
  const dispatch = useDispatch();
  const refreshData = React.useCallback(() => {
    dispatch(fetchWallets());
  }, []);
  const selectWallet = React.useCallback(
    (wallet) => {
      if (!currentWallet || wallet.id !== currentWallet.id) {
        dispatch(setCurrentWallet(wallet));
      }
    },
    [currentWallet]
  );
  return (
    <aside className={classes.wallet}>
      <div className={classes.walletHeader}>
        <h2>Баланс офиса</h2>
        <div>
          <ReloadOutlined className={classes.addWallet} onClick={refreshData} />
          <WalletAddModal className={classes.addWallet} />
        </div>
      </div>
      <div className={classes.cards}>
        {wallets.map((wallet) => (
          <div
            className={classnames(classes.creditCard, {
              [classes.creditCardActive]:
                currentWallet && currentWallet.id === wallet.id,
              [classes.disabledCard]: !wallet.is_active,
            })}
            key={wallet.id}
            onClick={() => selectWallet(wallet)}
            role="button"
            tabIndex={0}
          >
            <div className={classes.cardInfo}>
              <div className={classes.cardId}>{wallet.id}</div>
              <div className={classes.cardName}>{wallet.name}</div>
            </div>
            {wallet.balance ? (
              <div className={classes.cardBalance}>
                <h2>{wallet.balance}</h2>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default WalletSelector;
