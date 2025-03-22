import { createSlice } from '@reduxjs/toolkit'
import {
  checkUserExistsApi,
  getUserProfileApi,
  getUserStatisticsApi,
  SignUpApi,
  updateUserProfileDataApi,
  updateUserProfileImageApi
} from 'src/utils/api'
import { apiCallBegan } from '../actions/apiActions'
import { store } from '../store'

// state
const initialState = {
  data: null,
  isLogin: false,
  token: null
}

// slice
export const userSlice = createSlice({
  name: 'User',
  initialState,
  reducers: {
    loginSuccess: (user, action) => {
      let { data } = action.payload
      user.data = data
      user.token = data?.api_token
      user.isLogin = true
      user.data.userStatics = {}
      user.data.userProfileStatics = {}
      //Capitalize the first letter of first_name
      user.data.name = data?.name.charAt(0).toUpperCase() + data?.name.slice(1)
      return user
    },
    logoutSuccess: user => {
      user = initialState
      return user
    },
    imageUploadSuccess: (user, action) => {
      let { data } = action.payload
      user.data.profile = data?.profile ?? user.data?.profile
    },
    profileUpdateDataSuccess: (user, action) => {
      let data = action.payload
      user.data.name = data?.name ?? user.data?.name
      user.data.mobile = data?.mobile ?? user.data?.mobile
    },
    userStatictisDataSuccess: (user, action) => {
      let { data } = action.payload
      user.data.userStatics = data ?? user.data?.userStatics
    },
    userprofileStatictisDataSuccess: (user, action) => {
      let { data } = action.payload
      user.data.userProfileStatics = data ?? user.data?.userProfileStatics
    },
    updateUserDatainfo: (user, action) => {
      let { data } = action.payload

      // Update 'coins' if present in data
      user.data.userProfileStatics.coins = data?.coins ?? user.data?.userProfileStatics.coins

      // Update 'score' if present in data
      user.data.userProfileStatics.all_time_score = data?.score ?? user.data?.userProfileStatics.all_time_score

      // Update 'coins' if present in data
      user.data.coins = data?.coins ?? user.data?.coins

      // Update 'email' if present in data
      user.data.email = data?.email ?? user.data?.email
    },
    
  }
})

export const {
  loginSuccess,
  logoutSuccess,
  imageUploadSuccess,
  profileUpdateDataSuccess,
  userStatictisDataSuccess,
  userprofileStatictisDataSuccess,
  updateUserDatainfo
} = userSlice.actions
export default userSlice.reducer

// selectors
export const selectUser = state => state.User

// api calls

// register
export const register = (
  firebase_id,
  type,
  username,
  email,
  image_url,
  mobile,
  fcm_id,
  friends_code,
  onSuccess,
  onError,
  onStart
) => {
  store.dispatch(
    apiCallBegan({
      ...SignUpApi(firebase_id, type, username, email, image_url, mobile, fcm_id, friends_code),
      displayToast: false,
      onSuccessDispatch: loginSuccess.type,
      onStart,
      onSuccess,
      onError
    })
  )
}

// check user exists
export const checkUserExist = (firebase_id, onSuccess, onError, onStart) => {
  store.dispatch(
    apiCallBegan({
      ...checkUserExistsApi(firebase_id),
      displayToast: false,
      onStart,
      onSuccess,
      onError
    })
  )
}

// logout
export const logout = () => {
  store.dispatch(logoutSuccess())
}

// update Image profile
export const updateProfileApi = (image, onSuccess, onError, onStart) => {
  store.dispatch(
    apiCallBegan({
      ...updateUserProfileImageApi(image),
      displayToast: false,
      onSuccessDispatch: imageUploadSuccess.type,
      onStart,
      onSuccess,
      onError
    })
  )
}

// update name and mobile
export const updateProfileDataApi = (email, name, mobile, onSuccess, onError, onStart) => {
  store.dispatch(
    apiCallBegan({
      ...updateUserProfileDataApi(email, name, mobile),
      displayToast: false,
      onSuccessDispatch: profileUpdateDataSuccess.type,
      onStart,
      onSuccess,
      onError
    })
  )
}

// get user statistics
export const getUserStatisticsDataApi = (onSuccess, onError, onStart) => {
  store.dispatch(
    apiCallBegan({
      ...getUserStatisticsApi(),
      displayToast: false,
      onSuccessDispatch: userStatictisDataSuccess.type,
      onStart,
      onSuccess,
      onError
    })
  )
}

// get user statistics profile
export const getUserProfilestatisticsApi = (onSuccess, onError, onStart) => {
  store.dispatch(
    apiCallBegan({
      ...getUserProfileApi(),
      displayToast: false,
      onSuccessDispatch: userprofileStatictisDataSuccess.type,
      onStart,
      onSuccess,
      onError
    })
  )
}

// update user data
export const updateUserDataInfo = data => {
  store.dispatch(updateUserDatainfo({ data }))
}
