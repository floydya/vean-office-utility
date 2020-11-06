import { createSlice } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import { AppThunk, RootState } from '../../store';

const getData = (name: string, defaultValue: any = null) => {
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

const getApiURI = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://cr.vean-tattoo.com';
  }
  return 'http://localhost:8000';
};

export const authenticate = (): AppThunk => {
  return async (dispatch, getState) => {
    const { username, password } = getState().auth;
    dispatch(setErrors(null));
    dispatch(setLoading(true));
    try {
      const response = await fetch(`${getApiURI()}/api/v1/auth/jwt/obtain/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, parlor: null }),
      });
      if (response.status !== 200) {
        const errors = await response.json();
        dispatch(setErrors(errors));
      } else {
        const { token, user } = await response.json();
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
      const response = await fetch(`${getApiURI()}/api/v1/auth/current/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status !== 200) {
        dispatch(removeUser());
        dispatch(removeToken());
      } else {
        const user = await response.json();
        dispatch(setUser(user));
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
