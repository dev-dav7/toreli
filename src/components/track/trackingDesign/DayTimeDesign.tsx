import {observer} from "mobx-react-lite";
import React, {useRef} from "react";
import {ActionIcon, rem, Text,} from '@mantine/core';
import {TrackingOptionParameter} from "../../../models/trackingModels";
import {IOptionDesignProps} from "./IOptionDesignProps";
import {TimeInput} from "@mantine/dates";
import {IconClock} from "@tabler/icons-react";
import {trackControlStore as cs} from "../../../store/trackControlStore";

function DayTimeDesign(props: IOptionDesignProps) {

    const ref = useRef<HTMLInputElement>(null);
    const pickerControl =
        <ActionIcon variant="subtle" color="gray" onClick={() => ref.current?.showPicker()}>
            <IconClock style={{width: rem(16), height: rem(16)}} stroke={1.5}/>
        </ActionIcon>

    return <>
        <Text mt="5px" size="xs">время по умолчанию</Text>
        <TimeInput size="xs" ref={ref} rightSection={pickerControl}
                   value={cs.getOptionParameter(props.optionParams, TrackingOptionParameter.DefaultValue)}
                   onChange={(event) => cs.setOptionParameter(props.optionParams, TrackingOptionParameter.DefaultValue, event.target.value)}
        />
    </>

}

export default observer(DayTimeDesign);