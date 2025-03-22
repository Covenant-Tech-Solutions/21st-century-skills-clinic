import { createSelector, createSlice } from '@reduxjs/toolkit'
import { getSettingsApi, getSystemConfigurationsApi } from 'src/utils/api'
import { apiCallBegan } from '../actions/apiActions'
import { store } from '../store'
import moment from 'moment'

// initial state
const initialState = {
  data: null,
  loading: false,
  lastFetch: null,
  syslastFetch:null,
  systemConfig: {} //immutable data
}

// slice
export const settingsSlice = createSlice({
  name: 'Settings',
  initialState,
  reducers: {
    settingsRequested: (settings, action) => {
      settings.loading = true
    },
    settingsSucess: (settings, action) => {
      settings.data = action.payload.data
      settings.loading = false
      settings.lastFetch = Date.now()
    },
    settingsFailure: (settings, action) => {
      settings.loading = false
    },
    settingsConfigurationSucess: (settings, action) => {
      let { data } = action.payload
      settings.systemConfig = data
      settings.loading = false
      settings.syslastFetch = Date.now()
    }
  }
})

export const { settingsRequested, settingsSucess, settingsFailure, settingsConfigurationSucess } = settingsSlice.actions
export default settingsSlice.reducer

// API Callls
export const settingsLoaded = (type, onSuccess, onError, onStart) => {
  const state = store.getState()
  const { lastFetch } = state.Settings
  const diffInMinutes = moment().diff(moment(lastFetch), 'minutes')

  if (diffInMinutes < 10) return false

  store.dispatch(
    apiCallBegan({
      ...getSettingsApi(type),
      displayToast: false,
      onStartDispatch: settingsRequested.type,
      onSuccessDispatch: settingsSucess.type,
      onErrorDispatch: settingsFailure.type,
      onStart,
      onSuccess,
      onError
    })
  )
}

export const systemconfigApi = (onSuccess, onError, onStart) => {
  const state = store.getState()
  const { syslastFetch } = state.Settings
  const diffInMinutes = moment().diff(moment(syslastFetch), 'minutes')

  // If API data is fetched within last 10 minutes then don't call the API again
  if (diffInMinutes < 10) return false

  store.dispatch(
    apiCallBegan({
      ...getSystemConfigurationsApi(),
      displayToast: false,
      onSuccessDispatch: settingsConfigurationSucess.type,
      onStart,
      onSuccess,
      onError
    })
  )
}

// selectors
export const settingsData = createSelector(
  state => state.Settings,
  Settings => Settings.data
)

export const sysConfigdata = createSelector(
  state => state.Settings,
  Settings => Settings.systemConfig
)
