/* eslint-disable import/no-cycle */
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import authReducer from './features/login/login.store';
import activityReducer from './features/home/home.store';
import impostorReducer from './features/impostor/impostor.store';
import walletsReducer from './features/office/office.store';
import paymentsReducer from './features/incoming-payments/payments.store';
import activitiesReducer from './features/month/month.store';
import settingsReducer from './features/settings/settings.store';

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    auth: authReducer,
    activity: activityReducer,
    activities: activitiesReducer,
    settings: settingsReducer,
    impostor: impostorReducer,
    wallets: walletsReducer,
    payments: paymentsReducer,
    // counter: counterReducer,
  });
}
