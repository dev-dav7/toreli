import axios, {CreateAxiosDefaults} from 'axios';
import {jwtDecode} from 'jwt-decode';

//todo
export const API_URL = import.meta.env.PROD
    ? 'http://toreli.ru/api'
    : 'http://localhost:5249/api';

const api = axios.create(<CreateAxiosDefaults>{
    withCredentials: true,
    baseURL: API_URL,
    // validateStatus: (status) => status < 500
})

api.interceptors.request.use(async (config) => {
    await ensureAccessToken()
    const accessToken = localStorage.getItem('token')
    config.headers.Authorization = `Bearer ${(accessToken)}`
    return config
})

let refreshTokenAction: Promise<void> | null = null;

async function ensureAccessToken() {
    const accessToken = localStorage.getItem('token');
    if (accessToken === null)
        return;

    const {exp} = jwtDecode(accessToken);
    if (exp === undefined)
        return;

    if (exp > Date.now() / 1000)
        return;

    if (refreshTokenAction === null) {
        refreshTokenAction = axios.get<string>(`${API_URL}/auth/refresh?accessToken=${accessToken}`,
            {withCredentials: true})
            .then(response => {
                localStorage.setItem('token', response.data)
            })
            .catch(() => {
                window.location.pathname = "/auth"
                localStorage.removeItem('token')
            })
    }

    await refreshTokenAction;
    refreshTokenAction = null;
}

const defaultErrorText = "Ошибка запроса. Попробуйте обновтиь страницу или повторить действие позже"

api.interceptors.response.use((config) => {
    return config;
}, async (error) => {
    if (error.response && error.response.status) {
        const status = error.response.status;
        if (status === 401) {
            window.location.pathname = "/auth"
            localStorage.removeItem('token')
        } else {
            return Promise.reject(error.response.data.toString() || defaultErrorText)
        }
    } else {
        let errorText: string;
        if (error.response) {
            errorText = error.response.data.toString() || defaultErrorText
        } else if (error.request) {
            errorText = defaultErrorText
        } else {
            errorText = "Сервер временно недоступен"
        }
        return Promise.reject(errorText)
    }
})

export default api;