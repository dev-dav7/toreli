import {observer} from "mobx-react-lite";
import {Textarea,} from '@mantine/core';
import {trackControlStore as cs} from "../../../store/trackControlStore";
import {TrackingOptionParameter} from "../../../models/trackingModels";
import React from "react";
import {IOptionViewProps} from "./IOptionViewProps";

function NoteView({model, getValue, setValue}: IOptionViewProps) {

    const defaultValue = cs.getOptionParameter(model, TrackingOptionParameter.DefaultValue)
    const maxLength = cs.getOptionParameter(model, TrackingOptionParameter.MaxLength)
    const value = getValue()

    return <>
        <Textarea
            w={"95%"}
            variant={cs.getOptionParameter(model, TrackingOptionParameter.Style)}
            size={cs.getOptionParameter(model, TrackingOptionParameter.ElementSize)}
            autosize
            maxRows={5}
            placeholder={defaultValue}
            maxLength={maxLength}
            value={value !== undefined
                ? value
                : defaultValue}
            onChange={(event) => setValue(event.currentTarget.value)}
        />
    </>
}

export default observer(NoteView);