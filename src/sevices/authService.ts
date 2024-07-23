import api from "../http";
import { AxiosResponse} from 'axios';

export default class AuthService {
    static async login(login: string, pass: string): Promise<AxiosResponse<string>> {
        return api.post<string>('/auth', {
            login: login,
            pass: pass
        })
    }

    static async registration(login: string, password: string, birthday: Date): Promise<AxiosResponse<string>> {
        return api.post<string>('/auth/reg', {
            login:login,
            pass:password,
            birthday:birthday})
    }

    static async logout(): Promise<void> {
        return api.post("/auth/logout")
    }
}