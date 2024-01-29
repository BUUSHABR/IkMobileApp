import { configureStore } from '@reduxjs/toolkit';
import AppReducer from './src/reducers';
import VolatileReducer from './src/reducers/volatile';


import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
}

const persistedReducer = persistReducer(persistConfig, AppReducer);
export const store = configureStore({
  reducer: {
    'app': persistedReducer,
    'volatile': VolatileReducer
  },
  middleware: getDefaultMiddleware =>
  getDefaultMiddleware({
    serializableCheck: false,
  }),
});

export const persistor = persistStore(store);
