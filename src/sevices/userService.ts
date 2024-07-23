import api from "../http";
import {AxiosResponse} from 'axios';
import {UserModel} from "../models/models";

export default class UserService {
    static async getUserData(): Promise<AxiosResponse<UserModel>> {
        return api.post<UserModel>('/auth/getUser', {})
    }
}