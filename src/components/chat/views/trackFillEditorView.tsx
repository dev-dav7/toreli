import React, {useEffect, useRef, useState} from "react";
import {IChatViewProps} from "../models/IChatViewProps";
import {TrackViewModel} from "../../../models/trackingModels";
import {Text} from "@mantine/core";
import {trackControlStore as cs} from "../../../store/trackControlStore";
import {IChatActionProps} from "../models/IChatActionProps";
import {useElementSize} from "@mantine/hooks";
import {IconCircleArrowLeft, IconCircleArrowRight, IconCircleArrowUp} from "@tabler/icons-react";
import {observer} from "mobx-react-lite";
import {ChatActionType} from "../models/ChatActionType";
import ChatTrackView from "./chatTrackView";
import TrackValuesEditorView from "../../track/trackValuesEditor/trackValuesEditorView";

function TrackFillEditorView({
                                 userAction,
                                 scrollToBottomCallback,
                                 updateActionCallback,
                                 viewKey,
                                 data,
                                 chatWidth
                             }: IChatViewProps) {
    const {ref: viewRef, height: viewHeight} = useElementSize()
    const tracksOnShow = useRef<boolean>(false)

    const [switchTrackActions, setSwitchTrackActions] = useState<IChatActionProps[]>([])

    const [track, setTrack] = useState<TrackViewModel>(data.track)
    //Обработка действий от пользователя пришедших через контекстное меню
    useEffect(() => {
        if (!userAction)
            return

        if (userAction.type === "switch-track") {
            if (track.id !== userAction.value.id) {
                setTrack(userAction.value as TrackViewModel)
            }
        }

        if (userAction.type === "show") {
            if (userAction.value === "tracks") {
                if (tracksOnShow.current) {
                    tracksOnShow.current = false
                    updateContextActions([showTrackAction()])
                } else {
                    tracksOnShow.current = true
                    updateContextActions([showTrackAction(), ...switchTrackActions])
                }
            }
        }
    }, [userAction])

    //Промотка чата вниз
    useEffect(() => {
        scrollToBottomCallback!()
    }, [viewHeight])

    useEffect(() => {
        const switchActions: IChatActionProps[] = (data.trackSelector() as TrackViewModel[]).map(track => {
            return {
                color: cs.getTrackColor(track),
                text: cs.findTrackName(track),
                actions: [{
                    type: ChatActionType.SendToView,
                    value: {
                        type: "switch-track",
                        value: track
                    },
                    customIcon: <IconCircleArrowUp size={16}/>
                }, {
                    type: ChatActionType.ChangeView,
                    value: {
                        view: (props) => <ChatTrackView {...props} data={{
                            track: track,
                            yearCount: data.yearCount,
                            startYear: data.startYear,
                            trackSelector: data.trackSelector,
                            groupSelector: data.groupSelector,
                            isTracksOpen: tracksOnShow
                        }}/>
                    }
                }]
            }
        })
        setSwitchTrackActions(switchActions)

        setTrack(data.track as TrackViewModel)
        tracksOnShow.current = data.isTracksOpen

        if (tracksOnShow.current) {
            updateContextActions([showTrackAction(), ...switchActions])
        } else {
            updateContextActions([showTrackAction()])
        }
    }, [])


    return <div
        ref={viewRef}
        style={{width: (chatWidth ?? 425) - 50}}>
        <Text size="sm" ta={"center"}>редактор заполнения</Text>
        <TrackValuesEditorView updateValuesCallback={() => {
        }}
                               startYear={data.startYear}
                               tracks={data.trackSelector()}
                               groups={data.groupSelector()}
                               maxDate={new Date(data.startYear + data.yearCount, 0, 1)}
                               minDate={new Date(data.startYear, 0, 1)}
                               preSelectedTrack={track}
        />
    </div>

    //Обновление контекстных действий при открытии
    function updateContextActions(actions: IChatActionProps[]) {
        updateActionCallback(viewKey, actions)
    }

    function showTrackAction(): IChatActionProps {
        return {
            color: "green",
            text: "Все треки",
            actions: [{
                type: ChatActionType.SendToView,
                value: {
                    type: "show",
                    value: "tracks"
                },
                customIcon: tracksOnShow.current ? <IconCircleArrowLeft size={18}/> :
                    <IconCircleArrowRight size={18}/>,
            }]
        }
    }
}

export default observer(TrackFillEditorView)
