import { createSlice } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import { AppThunk, RootState } from '../../store';

const activitySlice = createSlice({
  name: 'activity',
  initialState: {
    currentTime: 0,
    status: false,
  },
  reducers: {
    setTime: (state, data) => {
      state.currentTime = data.payload;
    },
    setStatus: (state, data) => {
      state.status = data.payload;
    },
    tick: (state) => {
      state.currentTime += 1;
    },
  },
});

export const { setTime, setStatus, tick } = activitySlice.actions;

const getApiURI = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://cr.vean-tattoo.com';
  }
  return 'http://localhost:8000';
};

const setActivityData = (data: any): AppThunk => {
  return (dispatch) => {
    if (data) {
      dispatch(setStatus(!data.is_ended));
      dispatch(setTime(data.spent_time));
    } else {
      dispatch(setTime(0));
      dispatch(setStatus(false));
    }
  };
};

export const fetchActivity = (): AppThunk => {
  return async (dispatch, getState) => {
    const { token } = getState().auth;
    try {
      const currentDate = new Date().toISOString().substring(0, 10);
      const response = await fetch(
        `${getApiURI()}/api/v1/activity/${currentDate}/`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status !== 200) {
        // pass
      } else {
        const data = await response.json();
        dispatch(setActivityData(data));
        // const { activity } = response.json();
      }
    } catch (error) {
      // pass
    }
  };
};

export const toggleActivity = (): AppThunk => {
  return async (dispatch, getState) => {
    const { token } = getState().auth;
    try {
      const currentDate = new Date().toISOString().substring(0, 10);
      const response = await fetch(
        `${getApiURI()}/api/v1/activity/${currentDate}/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status !== 200) {
        const data = await response.json();
        dispatch(setActivityData(data));
      } else {
        console.log('ERROR');
      }
    } catch (error) {
      // pass
    }
  };
};

export default activitySlice.reducer;

export const selectTime = (state: RootState) => state.activity.currentTime;
export const selectStatus = (state: RootState) => state.activity.status;

// export const selectToken = (state: RootState) => state.auth.token;
// export const selectUser = (state: RootState) => state.auth.user;
// export const selectErrors = (state: RootState) => state.auth.errors;
// export const selectLoading = (state: RootState) => state.auth.loading;
