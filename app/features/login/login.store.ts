import { createSlice } from '@reduxjs/toolkit';
import UserAPI from '../../api/user.service';
// eslint-disable-next-line import/no-cycle
import { AppThunk, RootState } from '../../store';

const getData = (name: string, defaultValue: string | null = null) => {
  return localStorage.getItem(name) || defaultValue;
};

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: getData('token'),
    user: null,
    errors: null,
    username: getData('username', ''),
    password: getData('password', ''),
    loading: false,
  },
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
} = authSlice.actions;

export const authenticate = (): AppThunk => {
  return async (dispatch, getState) => {
    const { username, password } = getState().auth;
    dispatch(setErrors(null));
    dispatch(setLoading(true));
    try {
      const [status, response] = await UserAPI.authorize({
        username,
        password,
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
      const [status, response] = await UserAPI.fetchCurrentUser(token);
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
