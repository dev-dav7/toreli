import {TrackingOptionParameter} from "../../../models/trackingModels";

export interface IOptionViewProps {
    model: Map<TrackingOptionParameter, any>
    color: string
    getValue:()=>any
    setValue:(newValue:any)=>void
}
