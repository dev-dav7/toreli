import {observer} from "mobx-react-lite";
import React from "react";
import {IOptionDesignProps} from "./IOptionDesignProps";
import {TextInput} from "@mantine/core";
import {TrackingOptionParameter} from "../../../models/trackingModels";
import {trackControlStore as cs} from "../../../store/trackControlStore";

function NoteDesign(props: IOptionDesignProps): JSX.Element {
    return <>
        <TextInput size="xs"
                   placeholder="значение по умолчанию"
                   label="значение по умолчанию"
                   maxLength={30}
                   value={props.optionParams.get(TrackingOptionParameter.DefaultValue).value}
                   onChange={(event) => {
                       cs.setOptionParameter(props.optionParams, TrackingOptionParameter.DefaultValue, event.currentTarget.value)
                   }}
        />
    </>
}

export default observer(NoteDesign);