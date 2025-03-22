import { createSelector, createSlice } from '@reduxjs/toolkit'
import { getWebSettingsApi } from 'src/utils/api'
import { apiCallBegan } from '../actions/apiActions'
import { store } from '../store'
import moment from 'moment'

// state
const initialState = {
  data: [],
  loading: false,
  lastFetch: null
}

// slice
export const userSlice = createSlice({
  name: 'WebSettings',
  initialState,
  reducers: {
    webSettingsRequested: (web, action) => {
      web.loading = true
    },
    webSettingsSuccess: (web, action) => {
      let { data } = action.payload
      web.data = data
      web.loading = false
      web.lastFetch = Date.now()
    },
    webSettingsFailed: (web, action) => {
      web.loading = false
    }
  }
})

export const { webSettingsRequested, webSettingsSuccess, webSettingsFailed } = userSlice.actions
export default userSlice.reducer

// selectors
export const selectUser = state => state.User

// update name and mobile
export const LoadWebSettingsDataApi = (onSuccess, onError, onStart) => {
  const state = store.getState()
  const { lastFetch } = state.WebSettings ?? {}
  const diffInMinutes = moment().diff(moment(lastFetch), 'minutes')

  if (diffInMinutes < 10) return false
  store.dispatch(
    apiCallBegan({
      ...getWebSettingsApi(),
      displayToast: false,
      onStartDispatch: webSettingsRequested.type,
      onSuccessDispatch: webSettingsSuccess.type,
      onErrorDispatch: webSettingsFailed.type,
      onStart,
      onSuccess,
      onError
    })
  )
}

// Selector Functions
export const websettingsData = createSelector(
  state => state.WebSettings,
  WebSettings => WebSettings?.data
)
