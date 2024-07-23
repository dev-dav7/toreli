import {makeAutoObservable, runInAction} from "mobx";
import UserService from "../sevices/userService";
import {TrackViewModel} from "../models/trackingModels";
import {dateStore} from "./dateStore";

class MainStore {
    public isInit: boolean = false
    public isLoading: boolean = false

    public startYear: number = 1900
    public yearCount: number = 100
    public minDate: Date = new Date()
    public maxDate: Date = new Date()

    public selectedDate: Date | null = null
    public selectedDay: number = 0

    public tracksForShow: TrackViewModel[] = []

    constructor() {
        makeAutoObservable(this)
    }

    async init() {
        runInAction(() => {
            if (this.isInit || this.isLoading)
                return;

            this.isLoading = true
            this.load()
                .finally(() => {
                    this.isLoading = false
                    this.isInit = true
                })
        })
    }

    reset() {
        this.isInit = false
        this.selectedDate = null
        this.selectedDay = 0
    }

    async load() {
        this.reset()
        await UserService.getUserData()
            .then(x => {
                this.startYear = x.data.birthdayYear
                this.minDate = new Date(this.startYear, 0, 1)
                this.maxDate = new Date(this.startYear + this.yearCount, 0, 1)
            })

        const currentTime = new Date();
        this.setSelectedDate(new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate()))
    }

    public setSelectedDay(dayFrom: number) {
        this.selectedDate = dateStore.getDate(dayFrom, this.startYear)
        this.selectedDay = dayFrom
    }

    public setSelectedDate(date: Date | null) {
        this.selectedDate = date
        this.selectedDay = dateStore.getDay(date as Date, this.startYear)
    }

    public addTrackForShow(track: TrackViewModel) {
        if (this.tracksForShow.some(x => x.id === track.id))
            this.tracksForShow = this.tracksForShow.filter(x => x.id !== track.id)
        else
            this.tracksForShow.splice(0, 0, track)

        this.updateTracksForShow()
    }

    public moveTrackForShowUp(track: TrackViewModel) {
        const index = this.tracksForShow.indexOf(track)
        if (index > 0) {
            const oldValues = this.tracksForShow[index - 1]
            this.tracksForShow.splice(index - 1, 2, track, oldValues)
            this.updateTracksForShow()
        }
    }

    public moveTrackForShowDown(track: TrackViewModel) {
        const index = this.tracksForShow.indexOf(track)
        if (index < this.tracksForShow.length - 1) {
            const oldValues = this.tracksForShow[index + 1]
            this.tracksForShow.splice(index, 2, oldValues, track)
            this.updateTracksForShow()
        }
    }

    private updateTracksForShow() {
        //react не реагирует на изменение массива, только на присваивание
        mainStore.tracksForShow = this.tracksForShow.filter(() => true)
    }
}

export const mainStore: MainStore = new MainStore()