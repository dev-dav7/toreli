import {observer} from "mobx-react-lite";
import {Checkbox} from '@mantine/core';
import {trackControlStore as cs} from "../../../store/trackControlStore";
import {TrackingOptionParameter} from "../../../models/trackingModels";
import {IOptionViewProps} from "./IOptionViewProps";

function CheckView({model, color, getValue, setValue}: IOptionViewProps) {
    return <Checkbox
        color={color}
        variant={cs.getOptionParameter(model, TrackingOptionParameter.Style)}
        size={cs.getOptionParameter(model, TrackingOptionParameter.ElementSize)}
        checked={getValue()}
        onChange={(e) => setValue(e.currentTarget.checked)}/>
}

export default observer(CheckView);