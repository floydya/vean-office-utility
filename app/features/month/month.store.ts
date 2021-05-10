import { createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import { getApiURI } from '../../api/config';
// eslint-disable-next-line import/no-cycle
import { AppThunk } from '../../store';

const getMonthRange = (month: number, year: number): string[] => {
  let currentMoment = dayjs()
    .set('date', 10)
    .set('month', month - 1)
    .set('year', year);
  const endMoment = currentMoment.clone().add(1, 'month');
  const data = [];
  while (currentMoment.isBefore(endMoment)) {
    data.push(currentMoment.format('YYYY-MM-DD'));
    currentMoment = currentMoment.add(1, 'day');
  }
  return data;
};

const getCurrentMonthAndYear = () => {
  const currentMoment = dayjs();
  if (currentMoment.date() < 10) {
    return currentMoment.subtract(1, 'month');
  }
  return currentMoment;
};

type APIErrors = {
  non_field_errors?: string;
  month?: string;
  year?: string;
};

interface DateUserActivity {
  id: number;
  user: number;
  date: string;
  start_at: string;
  end_at?: string;
  is_ended: boolean;
  logs: {
    created_by: number;
    created_at: string;
    action: 'start' | 'resume' | 'end';
  }[];
  spent_time: number;
  parlor?: number;
}

interface SliceState {
  errors: APIErrors | null;
  activities: DateUserActivity[];
  monthRange: string[];
  loading: boolean;
  month: number;
  year: number;
}

const initialState: SliceState = {
  errors: null,
  activities: [],
  monthRange: getMonthRange(
    getCurrentMonthAndYear().month() + 1,
    getCurrentMonthAndYear().year()
  ),
  loading: false,
  month: getCurrentMonthAndYear().month() + 1,
  year: getCurrentMonthAndYear().year(),
};

const activitiesSlice = createSlice({
  name: 'activities',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.errors = null;
    },
    setErrors: (state, data) => {
      state.errors = data.payload;
    },
    setLoading: (state, data) => {
      state.loading = data.payload;
    },
    setActivities: (state, data) => {
      state.activities = data.payload;
    },
    setMonth: (state, data) => {
      state.month = data.payload;
      state.monthRange = getMonthRange(data.payload, state.year);
    },
    setYear: (state, data) => {
      state.year = data.payload;
      state.monthRange = getMonthRange(state.month, data.payload);
    },
  },
});

export const {
  setActivities,
  setErrors,
  clearErrors,
  setLoading,
  setMonth,
  setYear,
} = activitiesSlice.actions;

export const fetchActivities = (): AppThunk => {
  return async (dispatch, getState) => {
    try {
      dispatch(setLoading(true));
      const { token, user } = getState().auth;
      const { monthRange } = getState().activities;
      const [first, last] = [monthRange[0], monthRange[monthRange.length - 1]];
      const query = new URLSearchParams({
        user: user.id.toString(),
        date_after: first,
        date_before: last,
      }).toString();
      const response = await fetch(
        `${getApiURI()}/api/v1/activity/activity/?${query}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        dispatch(setActivities(await response.json()));
      } else {
        dispatch(setErrors(await response.json()));
      }
    } catch (error) {
      // pass
    }
    dispatch(setLoading(false));
  };
};

export default activitiesSlice.reducer;
