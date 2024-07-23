import {observer} from "mobx-react-lite";
import {Checkbox,} from '@mantine/core';
import {IOptionDesignProps} from "./IOptionDesignProps";
import {trackControlStore as cs} from "../../../store/trackControlStore";
import {TrackingOptionParameter} from "../../../models/trackingModels";

function CheckDesign(props: IOptionDesignProps) {
    return <>
        <Checkbox mt="5px"
                  variant="outline"
                  label="значение по умолчанию"
                  checked={props.optionParams.get(TrackingOptionParameter.DefaultValue)}
                  onChange={(event) => {
                      cs.setOptionParameter(props.optionParams, TrackingOptionParameter.DefaultValue, event.currentTarget.checked)
                  }}
        />
    </>
}

export default observer(CheckDesign);