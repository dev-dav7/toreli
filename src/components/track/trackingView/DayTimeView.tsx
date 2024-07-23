import {observer} from "mobx-react-lite";
import {ActionIcon, rem,} from '@mantine/core';
import {trackControlStore as cs} from "../../../store/trackControlStore";
import {TrackingOptionParameter} from "../../../models/trackingModels";
import React, {useRef} from "react";
import {IconClock} from "@tabler/icons-react";
import {TimeInput} from "@mantine/dates";
import {IOptionViewProps} from "./IOptionViewProps";

function DayTimeView({model, getValue, setValue}: IOptionViewProps) {

    const ref = useRef<HTMLInputElement>(null);

    const pickerControl = (
        <ActionIcon variant="subtle" color="gray" onClick={() => ref.current?.showPicker()}>
            <IconClock style={{width: rem(16), height: rem(16)}} stroke={1.5}/>
        </ActionIcon>
    );

    return <>
        <TimeInput
            variant={cs.getOptionParameter(model, TrackingOptionParameter.Style)}
            size={cs.getOptionParameter(model, TrackingOptionParameter.ElementSize)}
            ref={ref}
            rightSection={pickerControl}
            value={getValue()}
            onChange={(event) => setValue(event.target.value)}
        />
    </>
}

export default observer(DayTimeView);