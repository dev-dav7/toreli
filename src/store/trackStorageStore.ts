import {
    TrackValue,
    TrackingModelParameter, TrackingOptionParameter, TrackSerialisedModel, ValuesModel,
    TrackViewModel, SaveStorageRequest, StorageRecord, SetValueResponse
} from "../models/trackingModels";
import {makeAutoObservable, runInAction} from "mobx";
import UserService from "../sevices/userService";
import TrackingService from "../sevices/trackingService";
import {GroupModel} from "../models/models";
import GroupService from "../sevices/groupService";

class TrackStorageStore {

    public tracks: TrackViewModel[] = []
    public groups: GroupModel[] = []
    public values: ValuesModel[] = []
    public valueIterator: number = 0

    public isInit: boolean = false
    public isLoading: boolean = false
    public startYear: number = 1900
    public minDate: Date = new Date()
    public maxDate: Date = new Date()

    constructor() {
        makeAutoObservable(this)
    }

    private storageForAdd = new Map<string, StorageRecord>()
    private storageForSend = new Map<string, StorageRecord>()
    private delay = 500

    public pushForSave(request: SaveStorageRequest) {
        request.value = request.value.filter(x => x.values.length > 0)
        this.storageForAdd.set(request.trackId.toString() + request.day.toString(), {
            object: request,
            timeStamp: Date.now()
        })
        this.moveIterator()
    }

    saveWatcher = setInterval(this.saveWorker, 500)

    saveWorker() {
        if (!trackStorageStore.isInit)
            return

        trackStorageStore.storageForAdd.forEach((x, i) => trackStorageStore.storageForSend.set(i, x))
        trackStorageStore.storageForAdd.clear()

        const sendKeys: string[] = []
        trackStorageStore.storageForSend.forEach((x, i) => {
            if (Date.now() - x.timeStamp > trackStorageStore.delay) {
                TrackingService.setValue(x.object.trackId, x.object.day, x.object.day, x.object.value)
                sendKeys.push(i)
            }
        })
        sendKeys.forEach(k => trackStorageStore.storageForSend.delete(k))
    }

    async init() {
        runInAction(() => {
            if (this.isInit || this.isLoading)
                return

            this.isLoading = true
            this.isInit = false
            this.groups = []
            this.tracks = []
            this.load()
                .finally(() => {
                    this.isLoading = false
                    this.isInit = true
                })
        })
    }

    async load() {
        this.isLoading = true
        //todo цепочка запрсов вероятно не лучшее решение
        await UserService.getUserData()
            .then(() => GroupService.getGroups()
                .then(x => this.groups = x.data)
                .catch())
            .then(() => TrackingService.getTracks()
                .then(x => x.data.forEach(y => this.addOrUpdateTrack(this.restoreTrack(y))))
                .catch())
            .then(() => TrackingService.getValues()
                .then(x => {
                    this.valueIterator = 0
                    this.values = x.data
                }))
        this.isLoading = false
        this.isInit = true
    }

    public addOrUpdateTrack(track: TrackViewModel) {
        //todo эта стркоа не обязательна для всех
        this.tracks = this.tracks.filter(x => x.id !== track.id)
        this.tracks.push(track)
    }

    public restoreTrack(serialisedTrack: TrackSerialisedModel): TrackViewModel {
        const params = new Map(Object.entries(JSON.parse(serialisedTrack.params))) as Map<TrackingModelParameter, any>
        const viewOptions: Map<TrackingOptionParameter, any>[] = []
        const options = JSON.parse(serialisedTrack.options) as Map<TrackingOptionParameter, any>
        options.forEach(y => viewOptions.push(new Map(Object.entries(y)) as Map<TrackingOptionParameter, any>))

        return {
            id: serialisedTrack.id,
            groupId: serialisedTrack.groupId,
            params: params,
            viewOptions: viewOptions
        }
    }

    public getValuesForDay(day: number, track: TrackViewModel): TrackValue[] {
        const values = this.values
            .filter(x => day >= x.day && day <= x.dayE && x.trackId === track.id)

        return this.prepareValueForDay(values, day, track)
    }

    public removeValuesForDay(day: number, track: TrackViewModel, idToRemove: number): TrackValue[] {
        const values = this.values
            .filter(x => day >= x.day && day <= x.dayE && x.trackId === track.id)

        if (values.length === 1)
            values[0].values = values[0].values.filter(x => x.id !== idToRemove)

        this.moveIterator()

        return this.prepareValueForDay(values, day, track)
    }

    private prepareValueForDay(values: ValuesModel[], day: number, track: TrackViewModel): TrackValue[] {
        if (values.length === 1)
            return values[0].values

        if (values.length > 1)
            throw "Соу сори, слишком много записей на трек на день"

        const newValue = {
            day: day,
            dayE: day,
            trackId: track.id,
            values: [{
                id: 0,
                values: []
            }]
        }
        runInAction(() => this.values.push(newValue))
        return newValue.values
    }

    public removeGroup(group: GroupModel) {
        this.groups = this.groups.filter(x => x.id !== group.id)
    }

    public updateValues(trackId: number, newValues: SetValueResponse) {
        //todo обновляте значения, но не перерисовывается календарь
        this.values = this.values.filter(x =>
            (x.trackId !== trackId) ||
            (x.day < newValues.removeFrom || x.dayE > newValues.removeTo))
            .concat(newValues.add.map(n => {
                return {
                    trackId: trackId,
                    day: n.day,
                    dayE: n.dayE,
                    values: n.values
                }
            }))
        this.moveIterator()
    }

    private moveIterator() {
        this.valueIterator = this.valueIterator + 1
    }
}

export const trackStorageStore: TrackStorageStore = new TrackStorageStore()