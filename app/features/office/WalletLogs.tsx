/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import React from 'react';
import classnames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Popconfirm } from 'antd';
import dayjs from 'dayjs';
import ru from 'dayjs/locale/ru';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { RootState } from '../../store';
import classes from './WalletLogs.module.css';
import {
  cancelTransaction,
  loadMoreTransactions,
  WalletTransaction,
} from './office.store';
import TransferTransaction from './TransferTransaction';
import { MinusCash, PlusCash } from './Modals/AddTransaction';

dayjs.locale(ru);
dayjs.extend(localizedFormat);

interface WalletTransactionComponentProps {
  transaction: WalletTransaction;
}

const WalletTransactionComponent: React.FC<WalletTransactionComponentProps> = ({
  transaction,
}) => {
  const dispatch = useDispatch();
  const loading = useSelector((state: RootState) => state.wallets.loading);
  const [visible, setVisible] = React.useState(false);
  const cancel = React.useCallback((tr) => {
    dispatch(cancelTransaction(tr));
  }, []);
  return (
    <li
      className={classnames(
        classes.transaction,
        classes[transaction.transaction_type]
      )}
    >
      <div className={classes.transactionInfo}>
        <div className={classes.transactionAmountContainer}>
          <span className={classes.transactionId}>{transaction.id}</span>
          <h1 className={classnames(classes.transactionAmount)}>
            {transaction.amount}
          </h1>
        </div>
        <div>
          <h2>{transaction.reference}</h2>
          <div>
            <span
              style={{ borderRight: '1px white solid', paddingRight: '1rem' }}
            >
              {dayjs(transaction.created_at, 'DD.MM.YYYY HH:mm:ss').format(
                'LLLL'
              )}
            </span>
            {transaction.entity_type && transaction.entity_id && (
              <span style={{ paddingLeft: '1rem' }}>
                {transaction.entity_type}
                {' №'}
                {transaction.entity_id}
              </span>
            )}
          </div>
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        {transaction.transaction_type !== 'canceled' && (
          <TransferTransaction
            id={transaction.id}
            currentWallet={transaction.purpose}
          />
        )}
        {transaction.transaction_type !== 'canceled' && (
          <Popconfirm
            title="Уверены, что хотите откатить эту транзакцию?"
            visible={visible}
            okText="Да"
            cancelText="Нет"
            onConfirm={() => cancel(transaction)}
            okButtonProps={{ loading }}
            onCancel={() => setVisible(false)}
          >
            <Button
              style={{ width: '100%' }}
              loading={loading}
              danger
              onClick={() => setVisible(true)}
            >
              Отменить
            </Button>
          </Popconfirm>
        )}
      </div>
    </li>
  );
};

const WalletLogs = () => {
  const dispatch = useDispatch();
  const { currentWallet, transactions, loading } = useSelector(
    (state: RootState) => state.wallets
  );
  const fetchMore = React.useCallback(() => {
    dispatch(loadMoreTransactions());
  }, []);
  if (currentWallet === null) return null;
  return (
    <section className={classes.wrapper}>
      <div className={classes.logsHeader}>
        <h2>Текущий баланс</h2>
        <div>
          <PlusCash wallet_id={currentWallet.id} />
          <MinusCash wallet_id={currentWallet.id} />
        </div>
        <h1 className={classes.balance}>{currentWallet.balance}</h1>
      </div>
      {transactions.count > 0 ? (
        <>
          <ul className={classes.logsContent}>
            {transactions.results.map((transaction) => (
              <WalletTransactionComponent
                key={transaction.id}
                transaction={transaction}
              />
            ))}
          </ul>
          {transactions.next && (
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Button onClick={fetchMore} loading={loading}>
                Загрузить еще…
              </Button>
            </div>
          )}
        </>
      ) : (
        <div>Пока не было транзакций по этому счету.</div>
      )}
    </section>
  );
};

export default WalletLogs;
