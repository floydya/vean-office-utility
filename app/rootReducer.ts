import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
// eslint-disable-next-line import/no-cycle
// import counterReducer from './features/counter/counterSlice';
import authReducer from './features/login/login.store';
import activityReducer from './features/home/home.store';

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    auth: authReducer,
    activity: activityReducer,
    // counter: counterReducer,
  });
}
