import {
  Action,
  combineReducers,
  configureStore,
  ThunkAction,
} from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import {
  PersistedState,
  createMigrate,
  persistReducer,
  persistStore,
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import api from '../api/base';
import colors from '../reducers/colors';
import heatmap from '../reducers/heatmap';
import history from '../reducers/history';
import settings from '../reducers/settings';

const migrations = {
  0: () => ({} as PersistedState),
};

const persistConfig = {
  key: 'root',
  version: 0,
  storage,
  whitelist: ['settings'],
  migrate: createMigrate(migrations),
};

const rootReducer = combineReducers({
  colors,
  heatmap,
  history,
  settings,
  [api.reducerPath]: api.reducer,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(api.middleware),
});
export const persistor = persistStore(store);

setupListeners(store.dispatch);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
