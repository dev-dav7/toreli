import React, {useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import {mainStore} from "../../store/mainStore";
import {Tooltip} from '@mantine/core';
import {TrackViewModel} from "../../models/trackingModels";
import {trackStorageStore as ts} from "../../store/trackStorageStore";
import {trackControlStore as cs} from "../../store/trackControlStore";

interface IDateBlockProps {
    fillInStoreIndex: number
}

function DataTrackPreview({fillInStoreIndex}: IDateBlockProps) {

    const [isHover, setIsHover] = useState(false)
    const [track, setTrack] = useState<TrackViewModel>()
    const [infoText, setInfoText] = useState<string>()

    useEffect(() => {
        setTrack(ts.tracks.filter(x => x.id === fillInStoreIndex)[0])
        if (track !== undefined)
            setInfoText(cs.findTrackName(track))
    }, [mainStore.selectedDate, track])

    return (
        <div onClick={() => {
            if (track !== undefined) mainStore.addTrackForShow(track)
        }}>
            <Tooltip label={infoText}>
                <div className="dateBlock"
                     onMouseEnter={() => setIsHover(true)}
                     onMouseLeave={() => setIsHover(false)}
                     style={{
                         background: track ? cs.getTrackColor(track) : "",
                         width: "20px",
                         height: "20px",
                         borderRadius: "1px",
                         border: isHover ? "3px solid gray" : "",
                     }}
                />
            </Tooltip>
        </div>
    )

}

export default observer(DataTrackPreview);