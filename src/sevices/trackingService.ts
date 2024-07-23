import api from "../http";
import { AxiosResponse} from 'axios';
import {
    SetValueResponse,
    TrackFillModel,
    TrackFillsModel,
    TrackSerialisedModel,
    TrackValue,
    TrackViewModel,
    ValuesModel
} from "../models/trackingModels";

export default class TrackingService {

    static async createTrack(buildModel: TrackViewModel): Promise<AxiosResponse<TrackSerialisedModel>> {
        const objOptions: object[] = []
        buildModel.viewOptions.forEach(x => objOptions.push(Object.fromEntries(x)))

        return api.post<TrackSerialisedModel>('/track/create', {
                id: buildModel.id,
                groupId: buildModel.groupId,
                params: JSON.stringify(Object.fromEntries(buildModel.params)),
                options: JSON.stringify(objOptions)
            }
        )
    }

    static async getTracks(): Promise<AxiosResponse<TrackSerialisedModel[]>> {
        return api.post<TrackSerialisedModel[]>('/track/getAll')
    }

    static async setValue(trackId: number, day: number, dayE:number, values: TrackValue[]): Promise<AxiosResponse<void>> {
        return api.post<void>('/track/setValues', {
                trackId: trackId,
                day: day,
                dayE: dayE,
                values: values
            }
        )
    }

    static async fillValue(trackId: number, day: number, dayE:number, values: TrackValue[]): Promise<AxiosResponse<SetValueResponse>> {
        return api.post<SetValueResponse>('/track/fillValues', {
                trackId: trackId,
                day: day,
                dayE: dayE,
                values: values
            }
        )
    }

    static async getValues(): Promise<AxiosResponse<ValuesModel[]>> {
        return api.post<ValuesModel[]>('/track/getValues')
    }

    static async getValuesByTrackId(trackId:number): Promise<AxiosResponse<TrackFillsModel>> {
        return api.post<TrackFillsModel>(`/track/values/${trackId}`)
    }

    static async findTrackFill(trackId:number, day:number): Promise<AxiosResponse<TrackFillModel>> {
        return api.post<TrackFillModel>(`/track/values/${trackId}/${day}`)
    }
}