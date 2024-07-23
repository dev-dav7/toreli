import api from "../http";
import {AxiosResponse} from 'axios';
import {GroupModel} from "../models/models";

export default class GroupService {
    static async removeGroup(groupId: number): Promise<AxiosResponse> {
        return api.get<AxiosResponse>(`/group/remove/${groupId}`)
    }

    static async getGroups(): Promise<AxiosResponse<GroupModel[]>> {
        return api.get<GroupModel[]>('/group/getAll', {})
    }

    static async createGroup(name: string): Promise<AxiosResponse<GroupModel>> {
        return api.post<GroupModel>('/group/create', {
            name: name,
        })
    }
}