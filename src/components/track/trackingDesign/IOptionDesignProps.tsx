import {TrackingOptionParameter} from "../../../models/trackingModels";

export interface IOptionDesignProps {
    optionParams: Map<TrackingOptionParameter, any>
    color: string
    removeOptions: (idToRemove: number) => void
    moveUpOption: (idToRemove: number) => void
    moveDownOption: (idToRemove: number) => void
}
