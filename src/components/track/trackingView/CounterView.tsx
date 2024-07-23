import {observer} from "mobx-react-lite";
import {NumberInput,} from '@mantine/core';
import {trackControlStore as cs} from "../../../store/trackControlStore";
import {TrackingOptionParameter} from "../../../models/trackingModels";
import React from "react";
import {IOptionViewProps} from "./IOptionViewProps";

function CounterView({model, getValue, setValue}: IOptionViewProps) {
    const maxValue = cs.getOptionParameter(model, TrackingOptionParameter.MaxValue);
    const minValue = cs.getOptionParameter(model, TrackingOptionParameter.MinValue);
    const step = cs.getOptionParameter(model, TrackingOptionParameter.Step);

    return <div style={{width: "50%", minWidth: "120px"}}>
        <NumberInput
            maxLength={6}
            allowDecimal={false}
            min={minValue}
            max={maxValue}
            step={step}
            value={getValue()}
            onChange={(value) => setValue(value)}
            variant={cs.getOptionParameter(model, TrackingOptionParameter.Style)}
            size={cs.getOptionParameter(model, TrackingOptionParameter.ElementSize)}
        />
    </div>
}

export default observer(CounterView);