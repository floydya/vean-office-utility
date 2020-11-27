import { createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import { getApiURI } from '../../api/config';
// eslint-disable-next-line import/no-cycle
import { AppThunk } from '../../store';

const getMonthRange = (month: number, year: number) => {
  let currentMoment = dayjs()
    .set('date', 10)
    .set('month', month - 1)
    .set('year', year);
  const endMoment = currentMoment.clone().add(1, 'month');
  // console.log(currentMoment, endMoment);
  const data = [currentMoment.format('YYYY-MM-DD')];
  while (currentMoment.isBefore(endMoment)) {
    currentMoment = currentMoment.add(1, 'day');
    data.push(currentMoment.format('YYYY-MM-DD'));
  }
  return data;
};

const activitiesSlice = createSlice({
  name: 'activities',
  initialState: {
    errors: null,
    activities: [],
    monthRange: getMonthRange(
      new Date().getMonth() + 1,
      new Date().getFullYear()
    ),
    loading: false,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  },
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
        user: user.id,
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
