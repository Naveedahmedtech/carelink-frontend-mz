// store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import trainerReducer from './features/trainerSlice';
import registrationReducer from './features/auth/registrationSlice'; 

import { authApi } from './features/authApi';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux'; 
import { trainerApi } from './features/trainerApi';
import { participantApi } from './features/participantApi';

const rootReducer = combineReducers({
  auth: authReducer,
  trainer: trainerReducer,          
  registration: registrationReducer,  
  [authApi.reducerPath]: authApi.reducer,
  [trainerApi.reducerPath]: trainerApi.reducer,
  [participantApi.reducerPath]: participantApi.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(trainerApi.middleware)
      .concat(participantApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; // <-- ADD (handy)
