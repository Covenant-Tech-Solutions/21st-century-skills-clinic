import { createSelector, createSlice } from '@reduxjs/toolkit'
import { store } from '../store'
import { getNotificationsApi } from 'src/utils/api'
import { apiCallBegan } from '../actions/apiActions'

const initialState = {
  data: null,
  total: 0,
}

export const notificationSlice = createSlice({
  name: 'Notification',
  initialState,
  reducers: {
    notificationSuccess: (notification, action) => {
      // let old = notification.data ? JSON.parse(JSON.stringify(notification.data)) : { data: [] };
      // old.data = [...old.data, ...action.payload.data]
      // notification.data = old
       // Clone the existing data
       let oldData = notification.data ? JSON.parse(JSON.stringify(notification.data)) : { data: [] };

       // Check if incoming data contains items not already present in the existing data
       let newData = action.payload.data.filter(newItem => {
         return !oldData.data.some(oldItem => oldItem.id === newItem.id); // Assuming each item has a unique identifier like 'id'
       });
 
       // Append only the new data to the existing data
       oldData.data = [...oldData.data, ...newData];
 
       // Update the state with the merged data
       notification.data = oldData;
    },
    updateTotal:(notification,action) => {
      notification.total = action.payload
    }
  }
})

export const { notificationSuccess,updateTotal } = notificationSlice.actions
export default notificationSlice.reducer

export const loadNotification = ({
  id = '',
  order = '',
  offset = '',
  limit = '',
  onSuccess = () => {},
  onError = () => {},
  onStart = () => {}
}) => {
  store.dispatch(
    apiCallBegan({
      ...getNotificationsApi(id, order, offset, limit),
      displayToast: false,
      onSuccessDispatch: notificationSuccess.type,
      onStart,
      onSuccess,
      onError
    })
  )
}

// Selector Functions
export const notificationData = createSelector(
  state => state.Notification,
  Notification => Notification.data
)

export const notifiationTotal = createSelector(
  state => state.Notification,
  Notification => Notification.total
)
