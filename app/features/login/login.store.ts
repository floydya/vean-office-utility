import { createSlice } from '@reduxjs/toolkit';
import UserAPI from '../../api/user.service';
// eslint-disable-next-line import/no-cycle
import { AppThunk, RootState } from '../../store';

const getData = <T>(name: string, defaultValue: T) => {
  return localStorage.getItem(name) || defaultValue;
};

const getBooleanData = (name: string, defaultValue: boolean) => {
  return localStorage.getItem(name) === 'true' || defaultValue;
};

type UserType = {
  id: number;
} | null;

interface SliceState {
  token: string | null;
  user: UserType;
  errors: ErrorType;
  username: string | null;
  password: string | null;
  loading: boolean;
  remind: boolean;
}

const initialState: SliceState = {
  token: getData('token', null),
  user: null,
  errors: null,
  username: getData<string>('username', ''),
  password: getData<string>('password', ''),
  loading: false,
  remind: getBooleanData('remind', false),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, data) => {
      state.user = data.payload;
    },
    setToken: (state, data) => {
      state.token = data.payload;
      localStorage.setItem('token', data.payload);
    },
    removeToken: (state) => {
      state.token = null;
      localStorage.removeItem('token');
    },
    removeUser: (state) => {
      state.user = null;
    },
    clearErrors: (state) => {
      state.errors = null;
    },
    setErrors: (state, data) => {
      state.errors = data.payload;
    },
    setUsername: (state, data) => {
      state.username = data.payload;
      localStorage.setItem('username', data.payload);
    },
    setPassword: (state, data) => {
      state.password = data.payload;
      localStorage.setItem('password', data.payload);
    },
    setLoading: (state, data) => {
      state.loading = data.payload;
    },
    setRemind: (state, data) => {
      state.remind = data.payload;
      localStorage.setItem('remind', data.payload);
    },
    resetAuthentication: (state) => {
      state.remind = false;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('remind');
    },
  },
});

export const {
  setUser,
  setToken,
  removeToken,
  removeUser,
  setErrors,
  clearErrors,
  setUsername,
  setPassword,
  setLoading,
  setRemind,
  resetAuthentication,
} = authSlice.actions;

export const authenticate = (): AppThunk => {
  return async (dispatch, getState) => {
    const { username, password } = getState().auth;
    dispatch(setErrors(null));
    dispatch(setLoading(true));
    try {
      const [status, response] = await UserAPI.authorize({
        username: username as string,
        password: password as string,
      });
      if (status !== 200) {
        dispatch(setErrors(response));
      } else {
        const { token, user } = response;
        dispatch(setToken(token));
        dispatch(setUser(user));
      }
    } catch (error) {
      // pass
    }
    dispatch(setLoading(false));
  };
};

export const fetchUser = (): AppThunk => {
  return async (dispatch, getState) => {
    try {
      const { token } = getState().auth;
      const [status, response] = await UserAPI.fetchCurrentUser(
        token as string
      );
      if (status !== 200) {
        dispatch(removeUser());
        dispatch(removeToken());
      } else {
        dispatch(setUser(response));
      }
    } catch (error) {
      // pass
    }
  };
};

export const logoutUser = (): AppThunk => {
  return (dispatch) => {
    dispatch(removeUser());
    dispatch(removeToken());
  };
};

export default authSlice.reducer;

export const selectToken = (state: RootState) => state.auth.token;
export const selectUser = (state: RootState) => state.auth.user;
export const selectErrors = (state: RootState) => state.auth.errors;
export const selectLoading = (state: RootState) => state.auth.loading;
