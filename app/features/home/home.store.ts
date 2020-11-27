import { createSlice } from '@reduxjs/toolkit';
import { getApiURI } from '../../api/config';
// eslint-disable-next-line import/no-cycle
import { AppThunk, RootState } from '../../store';

const activitySlice = createSlice({
  name: 'activity',
  initialState: {
    currentTime: 0,
    status: false,
    notFinished: null,
    finishedTime: null,
    loading: false,
    error: null,
  },
  reducers: {
    setTime: (state, data) => {
      state.currentTime = data.payload;
    },
    setStatus: (state, data) => {
      state.status = data.payload;
    },
    setFinishedTime: (state, data) => {
      state.finishedTime = data.payload;
    },
    setLoading: (state, data) => {
      state.loading = data.payload;
    },
    setError: (state, data) => {
      state.error = data.payload;
    },
    tick: (state) => {
      state.currentTime += 1;
    },
    setNotFinished: (state, data) => {
      state.notFinished = data.payload;
    },
  },
});

export const {
  setTime,
  setStatus,
  tick,
  setNotFinished,
  setFinishedTime,
  setError,
  setLoading,
} = activitySlice.actions;

const setActivityData = (data: Record<string, unknown>): AppThunk => {
  return (dispatch) => {
    if (Object.keys(data).length > 0) {
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
      if (response.status === 201) {
        const data = await response.json();
        dispatch(setActivityData(data));
      } else if (response.status === 405) {
        const data = await response.json();
        dispatch(setNotFinished(data));
      }
    } catch (error) {
      // pass
    }
  };
};

export const finishLastDay = (): AppThunk => {
  return async (dispatch, getState) => {
    dispatch(setLoading(true));
    const { token } = getState().auth;
    const { notFinished, finishedTime } = getState().activity;
    try {
      const response = await fetch(
        `${getApiURI()}/api/v1/activity/${notFinished.date}/`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          method: 'PATCH',
          body: JSON.stringify({ end_at: finishedTime }),
        }
      );
      if (response.status === 200) {
        // const data = await response.json();
        dispatch(setNotFinished(null));
        dispatch(toggleActivity());
      } else {
        const data = await response.json();
        dispatch(setError(data));
      }
    } catch (error) {
      // pass
    }
    dispatch(setLoading(false));
  };
};

export default activitySlice.reducer;

export const selectTime = (state: RootState) => state.activity.currentTime;
export const selectStatus = (state: RootState) => state.activity.status;

// export const selectToken = (state: RootState) => state.auth.token;
// export const selectUser = (state: RootState) => state.auth.user;
// export const selectErrors = (state: RootState) => state.auth.errors;
// export const selectLoading = (state: RootState) => state.auth.loading;
