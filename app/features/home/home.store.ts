import { createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import TimerAPI from '../../api/timer.service';
// eslint-disable-next-line import/no-cycle
import { AppThunk, RootState } from '../../store';

dayjs.extend(customParseFormat);

type NotFinishedType = { date: string } | null;
interface ActivityLog {
  created_at: string;
  action: string;
}
interface SliceState {
  currentTime: number;
  beforeResume: number;
  status: boolean;
  notFinished: NotFinishedType;
  finishedTime: string;
  loading: boolean;
  error: ErrorType;
  logs: ActivityLog[];
}

const initialState: SliceState = {
  currentTime: 0,
  beforeResume: 0,
  status: false,
  notFinished: null,
  finishedTime: '',
  loading: false,
  error: null,
  logs: [],
};

const activitySlice = createSlice({
  name: 'activity',
  initialState,
  reducers: {
    setTime: (state, data) => {
      state.currentTime = data.payload;
    },
    setBeforeResume: (state, data) => {
      state.beforeResume = data.payload;
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
    setLogs: (state, data) => {
      state.logs = data.payload;
    },
    tick: (state) => {
      if (
        state?.logs[0]?.created_at &&
        ['start', 'resume'].includes(state?.logs[0]?.action)
      ) {
        const resumeSeconds = dayjs().diff(
          dayjs(state.logs[0].created_at, 'DD.MM.YYYY HH:mm:ss'),
          'second'
        );
        state.currentTime = state.beforeResume + resumeSeconds;
      }
    },
    setNotFinished: (state, data) => {
      state.notFinished = data.payload;
    },
  },
});

export const {
  setTime,
  setBeforeResume,
  setStatus,
  tick,
  setNotFinished,
  setFinishedTime,
  setError,
  setLogs,
  setLoading,
} = activitySlice.actions;

const setActivityData = (data: Record<string, unknown>): AppThunk => {
  return (dispatch) => {
    if (Object.keys(data).length > 0) {
      dispatch(setStatus(!data.is_ended));
      dispatch(setTime(data.spent_time));
      let beforeResume;
      if (['resume', 'start'].includes(data?.logs[0]?.action)) {
        beforeResume =
          data.spent_time -
          dayjs().diff(
            dayjs(data?.logs[0]?.created_at, 'DD.MM.YYYY HH:mm:ss'),
            'second'
          );
      } else {
        beforeResume = data.spent_time;
      }
      dispatch(setBeforeResume(beforeResume));
      dispatch(setLogs(data.logs));
    } else {
      dispatch(setTime(0));
      dispatch(setStatus(false));
      dispatch(setLogs([]));
    }
  };
};

export const fetchActivity = (): AppThunk => {
  return async (dispatch, getState) => {
    const { token } = getState().auth;
    try {
      const [status, response] = await TimerAPI.fetchTimer(token as string);
      if (status !== 200) {
        // pass
      } else {
        dispatch(setActivityData(response));
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
      dispatch(setLoading(true));
      const [status, response] = await TimerAPI.toggleTimer(token as string);
      if (status === 201) {
        dispatch(setActivityData(response));
      } else if (status === 405) {
        dispatch(setNotFinished(response));
      }
    } catch (error) {
      // pass
    }
    dispatch(setLoading(false));
  };
};

export const finishLastDay = (): AppThunk => {
  return async (dispatch, getState) => {
    dispatch(setLoading(true));
    const { token } = getState().auth;
    const { notFinished, finishedTime } = getState().activity;
    try {
      const [status, response] = await TimerAPI.finishLastDay(
        token as string,
        notFinished?.date as string,
        finishedTime
      );
      if (status === 200) {
        dispatch(setNotFinished(null));
        dispatch(toggleActivity());
      } else {
        dispatch(setError(response));
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
