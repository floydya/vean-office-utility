import { createSlice } from '@reduxjs/toolkit';
import { getApiURI } from '../../api/config';
// eslint-disable-next-line import/no-cycle
import { AppThunk } from '../../store';

export interface Wallet {
  id: number;
  name: string;
  balance: number;
  is_active: boolean;
}

export interface WalletTransaction {
  id: number;
  purpose: number;
  amount: number;
  reference: string;
  created_at: string;
  transaction_type: string;
  entity_type: string;
  entity_id: number;
}

interface SliceState {
  loading: boolean;
  wallets: Wallet[];
  transactions: {
    count: number;
    next: string | null;
    previous: string | null;
    results: WalletTransaction[];
  };
  currentWallet: Wallet | null;
}

const initialState: SliceState = {
  loading: false,
  wallets: [],
  transactions: {
    count: 0,
    next: null,
    previous: null,
    results: [],
  },
  currentWallet: null,
};

const officeSlice = createSlice({
  name: 'wallets',
  initialState,
  reducers: {
    setLoading: (state, { payload }) => {
      state.loading = payload;
    },
    setWallets: (state, { payload }) => {
      state.wallets = payload;
    },
    setCurrentWallet: (state, { payload }) => {
      state.currentWallet = payload;
    },
    setTransactions: (state, { payload }) => {
      state.transactions = payload;
    },
    addTransactions: (state, { payload }) => {
      state.transactions.next = payload.next;
      state.transactions.results = [
        ...state.transactions.results,
        ...payload.results,
      ];
    },
    addWallet: (state, { payload }) => {
      state.wallets = [...state.wallets, payload];
    },
    cancelWalletTransaction: (state, { payload }) => {
      try {
        const element = state.transactions.results.find(
          (tr) => tr.id === payload.id
        );
        if (element) {
          const index = state.transactions.results.indexOf(element);
          state.transactions.results[index].transaction_type = 'canceled';
          if (state.currentWallet) {
            state.currentWallet.balance -= element.amount;
            const wallet = state.wallets.find(
              (el) => el.id === state.currentWallet?.id
            );
            if (wallet) {
              const ind = state.wallets.indexOf(wallet);
              state.wallets[ind].balance = state.currentWallet.balance;
            }
          }
        }
      } catch (err) {
        // pass
      }
    },
    removeTransaction: (state, action) => {
      const transaction = state.transactions.results.find(
        (el) => el.id === action.payload
      );
      if (transaction) {
        const index = state.transactions.results.indexOf(transaction);
        const transactions = [...state.transactions.results];
        transactions.splice(index, 1);
        state.transactions.results = transactions;
        state.transactions.count -= 1;
      }
    },
  },
});

export const {
  setLoading,
  setWallets,
  setCurrentWallet,
  setTransactions,
  addTransactions,
  addWallet,
  cancelWalletTransaction,
  removeTransaction,
} = officeSlice.actions;

export const fetchWallets = (): AppThunk => {
  return async (dispatch, getState) => {
    try {
      dispatch(setLoading(true));
      const { token } = getState().auth;
      const { currentWallet } = getState().wallets;
      const response = await fetch(`${getApiURI()}/api/v4/wallets/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 202) {
        const wallets = await response.json();
        dispatch(setWallets(wallets));
        if (wallets.length && !currentWallet)
          dispatch(setCurrentWallet(wallets[0]));
      }
    } catch (error) {
      // pass
    }
    dispatch(setLoading(false));
  };
};

export const fetchWallet = (wallet: Wallet | null): AppThunk => {
  return async (dispatch, getState) => {
    try {
      dispatch(setTransactions(initialState.transactions));
      dispatch(setLoading(true));
      const { token } = getState().auth;
      const { currentWallet } = getState().wallets;
      if (wallet || currentWallet) {
        const response = await fetch(
          `${getApiURI()}/api/v4/transactions/?purpose=${
            (wallet || currentWallet)?.id
          }`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          dispatch(setTransactions(await response.json()));
        }
      }
    } catch (error) {
      // pass
    }
    dispatch(setLoading(false));
  };
};

export const loadMoreTransactions = (): AppThunk => {
  return async (dispatch, getState) => {
    try {
      dispatch(setLoading(true));
      const { token } = getState().auth;
      const { next } = getState().wallets.transactions;
      if (next) {
        const response = await fetch(next, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          dispatch(addTransactions(await response.json()));
        }
      }
    } catch (error) {
      // pass
    }
    dispatch(setLoading(false));
  };
};

export const createWallet = (name: string): AppThunk => {
  return async (dispatch, getState) => {
    try {
      dispatch(setLoading(true));
      const { token } = getState().auth;
      const response = await fetch(`${getApiURI()}/api/v4/wallets/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });
      if (response.status === 201) {
        const responseData = await response.json();
        dispatch(addWallet(responseData));
      }
    } catch (err) {
      // pass
    }
    dispatch(setLoading(false));
  };
};

export const cancelTransaction = (transaction: WalletTransaction): AppThunk => {
  return async (dispatch, getState) => {
    try {
      dispatch(setLoading(false));
      const { token } = getState().auth;
      const response = await fetch(
        `${getApiURI()}/api/v4/transactions/${transaction.id}/cancel/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 202) {
        // const responseData = await response.json();
        dispatch(cancelWalletTransaction(transaction));
      }
    } catch (err) {
      // pass
    }
    dispatch(setLoading(true));
  };
};

export default officeSlice.reducer;
