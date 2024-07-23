import {
    TrackingModelParameter,
    TrackingOptionParameter,
    TrackingType,
    TrackValue,
    TrackViewModel
} from "../models/trackingModels";
import {makeAutoObservable} from "mobx";

class TrackControlStore {

    constructor() {
        makeAutoObservable(this)
    }

    public maxValuesCount: number = 5

    getTrackParameter = (from: TrackViewModel, param: TrackingModelParameter) => {
        return from.params.get(param)
    }

    //todo Заиспользовать для всех мест где ищется цвет
    getTrackColor = (from: TrackViewModel):string => {
        return this.getTrackParameter(from, TrackingModelParameter.Color)
    }

    setTrackParameter = (model: TrackViewModel, param: TrackingModelParameter, value: any) => {
        model.params.set(param, value)
    }

    getOptionParameter = (options: Map<TrackingOptionParameter, any>, option: TrackingOptionParameter) => {
        return options.get(option)
    }

    setOptionParameter = (options: Map<TrackingOptionParameter, any>, option: TrackingOptionParameter, value: any) => {
        options.set(option, value)
    }

    getValue = (options: Map<TrackingOptionParameter, any>,
                optionValues: TrackValue,
                optionId: number) => {
        const value = optionValues.values.filter(v => v.id === optionId)
        return value.length === 0
            ? this.getOptionParameter(options, TrackingOptionParameter.Type) === TrackingType.Note
                ? ""
                : this.getOptionParameter(options, TrackingOptionParameter.DefaultValue)
            : value[0].value
    }

    setValue = (options: Map<TrackingOptionParameter, any>,
                optionValues: TrackValue,
                optionId: number,
                newValue: any) => {
        optionValues.values = optionValues.values.filter(x => x.id !== optionId)
        if (newValue === this.getOptionParameter(options, TrackingOptionParameter.DefaultValue) ||
            (this.getOptionParameter(options, TrackingOptionParameter.Type) === TrackingType.Note && newValue === ""))
            return

        optionValues.values.push({
            id: optionId,
            value: newValue
        })
    }

    appendValues = (trackViewModel: TrackViewModel, values: TrackValue[]) => {
        if (!this.getTrackParameter(trackViewModel, TrackingModelParameter.List))
            return

        if (values.length >= this.maxValuesCount)
            return

        values.push({
            id: values.length === 0 ? 0 : Math.max.apply(null, values.map(x => x.id)) + 1,
            values: []
        })
    }

    removeValues = (values: TrackValue[], id: number) => {
        const newValues = values.filter(x => x.id !== id)
        if (newValues.length === 0)
            return [{
                id: 0,
                values: []
            }];
        return newValues
    }

    getLabelStyle = (options: Map<TrackingOptionParameter, any>) => {
        const labelsSize = this.getOptionParameter(options, TrackingOptionParameter.LabelSize)
        switch (this.getOptionParameter(options, TrackingOptionParameter.LabelPosition)) {
            case "l":
                return {direction: "row", justify: "flex-start", labelSize: labelsSize}
            case "r":
                return {direction: "row-reverse", justify: "flex-end", labelSize: labelsSize}
            case "t":
                return {direction: "column", justify: "flex-start", labelSize: labelsSize}
            case "d":
                return {direction: "column-reverse", justify: "flex-start", labelSize: labelsSize}
        }
        return {direction: "row", justify: "flex-start", labelSize: labelsSize}
    }

    findTrackName = (track: TrackViewModel): string => {
        const trackName = this.getTrackParameter(track, TrackingModelParameter.Name)
        if (trackName)
            return trackName

        return track.viewOptions
            .map(option => this.getOptionParameter(option, TrackingOptionParameter.Name))
            .find(x => !!x)
    }
}

export const trackControlStore: TrackControlStore = new TrackControlStore();