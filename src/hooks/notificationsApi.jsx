import Api from '../api/AxiosInterceptors.jsx'
import { GET_NOTIFICATIONS } from 'src/utils/api.jsx'

export const notificationApi = {
    getNotificationsApi: (order, offset, limit) => {
        return Api.post(GET_NOTIFICATIONS, {
             order, offset, limit 
        })
    }
}
