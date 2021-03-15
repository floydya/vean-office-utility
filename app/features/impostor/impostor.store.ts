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

const impostorSlice = createSlice({
  name: 'impostor',
  initialState: {
    errors: null,
    employees: [],
    activities: [],
    hoursPerDay: "",
    salary: "",
    monthRange: getMonthRange(
      getCurrentMonthAndYear().month() + 1,
      getCurrentMonthAndYear().year()
    ),
    loading: false,
    employee: "",
    month: getCurrentMonthAndYear().month() + 1,
    year: getCurrentMonthAndYear().year(),
  },
  reducers: {
    clearErrors: (state) => {
      state.errors = null;
    },
    setErrors: (state, data) => {
      state.errors = data.payload;
    },
    setHoursPerDay: (state, data) => {
      state.hoursPerDay = data.payload;
    },
    setSalary: (state, data) => {
      state.salary = data.payload;
    },
    setLoading: (state, data) => {
      state.loading = data.payload;
    },
    setActivities: (state, data) => {
      state.activities = data.payload;
    },
    setEmployees: (state, data) => {
      state.employees = data.payload;
    },
    setEmployee: (state, data) => {
      state.employee = data.payload;
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
  setEmployee,
  setEmployees,
  setSalary,
  setHoursPerDay,
  clearErrors,
  setLoading,
  setMonth,
  setYear,
} = impostorSlice.actions;

export const fetchEmployees = (): AppThunk => {
  return async (dispatch, getState) => {
    try {
      dispatch(setLoading(true));
      const { token } = getState().auth;
      const response = await fetch(
        `${getApiURI()}/api/v2/employees/`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          }
        }
      );
      if (response.status === 200) {
        const employees = await response.json();
        dispatch(setEmployees(employees));
      } else {
        dispatch(setErrors(await response.json()));
      }
    } catch {
      // pass
    }
    dispatch(setLoading(false));
  }
}

export const fetchActivities = (): AppThunk => {
  return async (dispatch, getState) => {
    const { monthRange, employee } = getState().impostor;
    if (!employee) return
    try {
      dispatch(setLoading(true));
      const { token } = getState().auth;
      const [first, last] = [monthRange[0], monthRange[monthRange.length - 1]];
      const query = new URLSearchParams({
        user: employee,
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

export default impostorSlice.reducer;
