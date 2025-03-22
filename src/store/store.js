import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import userReducer from './reducers/userSlice'
import languageReducer from './reducers/languageSlice'
import settingsReducer from './reducers/settingsSlice'
import tempdataReducer from './reducers/tempDataSlice'
import bookmarkReducer from './reducers/bookmarkSlice'
import groupbattleReducer from './reducers/groupbattleSlice'
import badgeReducer from './reducers/badgesSlice'
import webSettingsReducer from './reducers/webSettings'
import homeReducer from './reducers/homeSlice'
import notificationReducer from './reducers/notificationSlice'
import api from '../store/middleware/api'
import userCoinsSlice from './reducers/userCoinsSlice'

const persistConfig = {
  key: 'root',
  storage
}

const rootReducer = combineReducers({
  User: userReducer,
  Languages: languageReducer,
  Settings: settingsReducer,
  Tempdata: tempdataReducer,
  Bookmark: bookmarkReducer,
  GroupBattle: groupbattleReducer,
  Badges: badgeReducer,
  WebSettings: webSettingsReducer,
  Home: homeReducer,
  Notification: notificationReducer,
  UserCoins: userCoinsSlice
})

export const store = configureStore({
  reducer: persistReducer(persistConfig, rootReducer),
  middleware: [api]
})

export const persistor = persistStore(store)
