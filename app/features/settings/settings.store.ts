import { createSlice } from '@reduxjs/toolkit';

const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    salary: localStorage.getItem('salary') || null,
    hours_per_day: localStorage.getItem('hours_per_day') || null,
  },
  reducers: {
    setSalary: (state, data) => {
      state.salary = data.payload;
      localStorage.setItem('salary', data.payload);
    },
    setHoursPerDay: (state, data) => {
      state.hours_per_day = data.payload;
      localStorage.setItem('hours_per_day', data.payload);
    },
  },
});

export const { setSalary, setHoursPerDay } = settingsSlice.actions;
export default settingsSlice.reducer;
