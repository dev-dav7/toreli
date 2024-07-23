import {observer} from "mobx-react-lite";
import React, {useState} from "react";
import {
    TrackingModelParameter,
    TrackingOptionParameter,
    TrackValue,
    TrackViewModel,
} from "../../../models/trackingModels";
import OptionView from "./OptionView";
import {trackControlStore as cs} from "../../../store/trackControlStore";
import {ActionIcon, Tooltip} from "@mantine/core";
import {IconTrash} from "@tabler/icons-react";

export interface ITrackEntryProps {
    track: TrackViewModel,
    values: TrackValue,
    isInRemoveMode: boolean,
    removeValueCallback?: (id: number) => void,
    saveCallback?: () => void,
}

function TrackEntryView({track, values, isInRemoveMode, removeValueCallback, saveCallback}: ITrackEntryProps) {
    const [isHover, setIsHover] = useState(false)

    const isList = cs.getTrackParameter(track, TrackingModelParameter.List)

    const handleMouseEnter = () => setIsHover(true)
    const handleMouseLeave = () => setIsHover(false)

    return <div
        style={{
            borderRadius: "5px",
            paddingTop: (isInRemoveMode ? "5px" : "3px"),
            paddingBottom: (isInRemoveMode ? "5px" : "5px"),
            background: (isHover && isList ? isInRemoveMode ? "#ebebebff" : "#f5f5f594" : "")
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
    >
        <div style={{padding:"5px"}}>
            {isInRemoveMode &&
            <Tooltip
                label="Удалить"
                offset={5}
                arrowOffset={20} arrowSize={10}
                openDelay={1000}
                withArrow position="top-start">
                <ActionIcon variant="subtle"
                            color="gray"
                            size="compact-md"
                            p={5}
                            ml={5}
                            radius={4}
                            onClick={remove}>
                    <IconTrash size={14}/>
                </ActionIcon>
            </Tooltip>}
            {track.viewOptions.map((x, i) => {
                const id = cs.getOptionParameter(x, TrackingOptionParameter.Id)
                const lastElem = i === track.viewOptions.length - 1
                return <div
                    key={id}
                    style={{
                        marginBottom: lastElem ? "0px" : "5px",
                        marginTop: i === 0 ? "3px" : "0",
                    }}>
                    <OptionView model={x}
                                key={cs.getOptionParameter(x, TrackingOptionParameter.Id)}
                                getValue={() => cs.getValue(x, values, id)}
                                setValue={(newValue: any) => save(x, id, newValue)}
                                color={cs.getTrackColor(track)}
                    />
                </div>
            })}
        </div>
    </div>

    function remove() {
        if (removeValueCallback !== undefined)
            removeValueCallback(values.id)
    }

    function save(x: Map<TrackingOptionParameter, any>, id: number, newValue: any) {
        cs.setValue(x, values, id, newValue)
        if (saveCallback !== undefined)
            saveCallback()
    }
}

export default observer(TrackEntryView);