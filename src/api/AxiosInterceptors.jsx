import axios from 'axios'
import { store } from '../store/store'

const Api = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_END_POINT}`
})

Api.interceptors.request.use(function (config) {
    let token = undefined


    if (typeof window !== 'undefined') {
        token = store.getState()?.User?.token
    }

    if (token) config.headers.authorization = `Bearer ${token}`

    return config
})
export default Api
