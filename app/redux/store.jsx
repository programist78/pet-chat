import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { authReducer } from './slices/auth'
import { adminReducer } from './slices/roles/admin'
import { peopleReducer } from './slices/roles/people'
import { userInfoReducer } from './slices/user'
import storage from 'redux-persist/lib/storage'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import { cartReducer } from './slices/slice'

const rootReducer = combineReducers({
  auth: authReducer,
  admin: adminReducer,
  people: peopleReducer,
  cart: cartReducer,
  info: userInfoReducer
})

const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
  // reducer: {
  //   auth: authReducer,
  //   admin: adminReducer,
  //   people: peopleReducer,
  // },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)
export default store
