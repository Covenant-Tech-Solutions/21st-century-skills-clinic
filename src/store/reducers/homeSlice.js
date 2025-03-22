import { createSelector, createSlice } from '@reduxjs/toolkit'
import moment from 'moment'
import { getHomeWebSettingsApi } from 'src/utils/api'
import { apiCallBegan } from '../actions/apiActions'
import { store } from '../store'

const initialState = {
  data: {},
  loading: false,
  lastFetch: null,
  Lang: null
}

export const slice = createSlice({
  name: 'Home',
  initialState,
  reducers: {
    homeRequested: home => {
      home.loading = true
    },
    homeReceived: (home, action) => {
      home.data = action.payload.data
      home.loading = false
      home.lastFetch = Date.now()
      home.Lang = action.request
    },
    homeRequestFailed: home => {
      home.loading = true
    },
    homeUpdateLanguage: (home, action) => {
        if(home.Lang){
            home.Lang.language_id = action.payload
        }
   
    }
  }
})

export const { homeRequested, homeReceived, homeRequestFailed, homeUpdateLanguage } = slice.actions
export default slice.reducer

// API Calls
export const loadHome = ({ onSuccess = () => {}, onError = () => {}, onStart = () => {} }) => {
  const state = store.getState()
  const { currentLanguage } = store.getState().Languages
  const { lastFetch, Lang } = state.Home
  const diffInMinutes = moment().diff(moment(lastFetch), 'minutes')

  if ((currentLanguage?.id != Lang?.language_id) || diffInMinutes > 10) {
    store.dispatch(
      apiCallBegan({
        ...getHomeWebSettingsApi(),
        displayToast: false,
        onStartDispatch: homeRequested.type,
        onSuccessDispatch: homeReceived.type,
        onErrorDispatch: homeRequestFailed.type,
        onStart,
        onSuccess,
        onError
      })
    )
  }
}

// Selector Functions
export const selectHome = createSelector(
  state => state.Home,
  Home => Home
)
