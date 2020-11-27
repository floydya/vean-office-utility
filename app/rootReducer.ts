import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
// eslint-disable-next-line import/no-cycle
import authReducer from './features/login/login.store';
// eslint-disable-next-line import/no-cycle
import activityReducer from './features/home/home.store';
// eslint-disable-next-line import/no-cycle
import activitiesReducer from './features/month/month.store';
import settingsReducer from './features/settings/settings.store';

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    auth: authReducer,
    activity: activityReducer,
    activities: activitiesReducer,
    settings: settingsReducer,
    // counter: counterReducer,
  });
}
