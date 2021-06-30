/* eslint-disable import/no-cycle */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getApiURI } from '../../api/config';
import { AppThunk } from '../../store';

interface User {
  id: number;
  get_full_name: string;
  role: string;
}

interface Parlor {
  id: number;
  name: string;
}

interface IncomingPaymentCategory {
  id: number;
  name: string;
  order: number;
}

export interface IncomingPayment {
  id: number;
  value: number;
  note: string;
  image: string;
  created_at: string;
  created_by: User | null;
  marketing: null;
  payed: boolean;
  payed_at: string | null;
  payed_by: User | null;
  canceled: boolean;
  canceled_at: string | null;
  canceled_by: User | null;
  parlor: Parlor;
  category: IncomingPaymentCategory;
  moderated: boolean;
  moderation_comment: string;
}

interface IncomingPaymentAPIResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: IncomingPayment[];
}

interface SliceState {
  loading: boolean;
  incoming_payments: IncomingPaymentAPIResponse;
}

const initialState: SliceState = {
  loading: false,
  incoming_payments: {
    count: 0,
    next: null,
    previous: null,
    results: [],
  },
};

const paymentsSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setIncomingPayments: (
      state,
      action: PayloadAction<IncomingPaymentAPIResponse>
    ) => {
      state.incoming_payments = action.payload;
    },
    addIncomingPayments: (
      state,
      action: PayloadAction<IncomingPaymentAPIResponse>
    ) => {
      state.incoming_payments.results = [
        ...state.incoming_payments.results,
        ...action.payload.results,
      ];
      state.incoming_payments.next = action.payload.next;
    },
    removeIncomingPayment: (state, action: PayloadAction<number>) => {
      const payment = state.incoming_payments.results.find(
        (el) => el.id === action.payload
      );
      if (payment) {
        const index = state.incoming_payments.results.indexOf(payment);
        const payments = [...state.incoming_payments.results];
        payments.splice(index, 1);
        state.incoming_payments.results = payments;
        state.incoming_payments.count -= 1;
      }
    },
  },
});

export const {
  setLoading,
  setIncomingPayments,
  addIncomingPayments,
  removeIncomingPayment,
} = paymentsSlice.actions;

export const fetchIncomingPayments = (): AppThunk => {
  return async (dispatch, getState) => {
    try {
      dispatch(setLoading(true));
      const { token } = getState().auth;
      const response = await fetch(`${getApiURI()}/api/v4/incoming-payments/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        dispatch(setIncomingPayments(await response.json()));
      }
    } catch (err) {
      // pass
    }
    dispatch(setLoading(false));
  };
};

export const loadMorePayments = (): AppThunk => {
  return async (dispatch, getState) => {
    dispatch(setLoading(true));
    try {
      const { token } = getState().auth;
      const { next } = getState().payments.incoming_payments;
      if (next) {
        const response = await fetch(next, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          dispatch(addIncomingPayments(await response.json()));
        }
      }
    } catch (err) {
      // pass
    }
    dispatch(setLoading(false));
  };
};

export default paymentsSlice.reducer;
