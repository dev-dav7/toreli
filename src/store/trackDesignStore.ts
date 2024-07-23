import {makeAutoObservable} from 'mobx';
import {
    TrackValue,
    TrackingModelParameter,
    TrackingOptionParameter,
    TrackingType,
    TrackingTypeToOptionType,
    TrackViewModel,
} from "../models/trackingModels";
import {trackControlStore as cs} from "../store/trackControlStore";

export default class TrackDesignStore {
    public maxOptionsCount: number = 5

    public constructedTrack: TrackViewModel = {
        id: 0,
        groupId: undefined,
        params: new Map<TrackingModelParameter, any>(),
        viewOptions: [],
    }

    public exampleValues: TrackValue[] = [{
        id: 0,
        values: []
    }]

    constructor() {
        makeAutoObservable(this)
        this.flush()
        this.constructedTrack.params.set(TrackingModelParameter.Color, "#336600ff")
        this.constructedTrack.params.set(TrackingModelParameter.List, false)
        this.constructedTrack.params.set(TrackingModelParameter.Name, "")
    }

    flush() {
        this.constructedTrack.id = 0
        this.constructedTrack.params = new Map<TrackingModelParameter, any>()
        this.constructedTrack.params.set(TrackingModelParameter.List, false)
        this.constructedTrack.params.set(TrackingModelParameter.Name, "")
        this.constructedTrack.viewOptions = []
    }

    removeOptions = (idToRemove: number) => {
        this.constructedTrack.viewOptions = this.constructedTrack.viewOptions.filter(x => cs.getOptionParameter(x, TrackingOptionParameter.Id) !== idToRemove)
    }

    moveUpOption = (id: number) => {
        const index = this.constructedTrack.viewOptions.findIndex(x => cs.getOptionParameter(x, TrackingOptionParameter.Id) === id)
        if (index === 0)
            return
        const value = this.constructedTrack.viewOptions[index]
        this.constructedTrack.viewOptions[index] = this.constructedTrack.viewOptions[index - 1]
        this.constructedTrack.viewOptions[index - 1] = value
    }

    moveDownOption = (id: number) => {
        const index = this.constructedTrack.viewOptions.findIndex(x => cs.getOptionParameter(x, TrackingOptionParameter.Id) === id)
        if (index === this.constructedTrack.viewOptions.length - 1)
            return
        const value = this.constructedTrack.viewOptions[index]
        this.constructedTrack.viewOptions[index] = this.constructedTrack.viewOptions[index + 1]
        this.constructedTrack.viewOptions[index + 1] = value
    }

    addOption = (type: TrackingType) => {
        const newOption = new Map<TrackingOptionParameter, any>()
        TrackingTypeToOptionType[type].forEach(item => {
            newOption.set(item.option, item.value)
        })
        newOption.set(TrackingOptionParameter.Id, this.getNextOptionId())
        this.constructedTrack.viewOptions.push(newOption)
    }

    getNextOptionId = (): number => {
        if (this.constructedTrack.viewOptions.length === 0)
            return 0
        return Math.max.apply(null, this.constructedTrack.viewOptions.map(x =>
            cs.getOptionParameter(x, TrackingOptionParameter.Id))) + 1
    }
}
