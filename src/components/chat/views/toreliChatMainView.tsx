import React, {useEffect, useRef, useState} from "react";
import {observer} from "mobx-react-lite";
import {IChatViewProps} from "../models/IChatViewProps";
import {IChatActionProps} from "../models/IChatActionProps";
import {useElementSize} from "@mantine/hooks";
import {Text,} from '@mantine/core';
import {trackControlStore as cs} from "../../../store/trackControlStore";
import {ChatActionType} from "../models/ChatActionType";
import {TrackViewModel} from "../../../models/trackingModels";
import {IconCircleArrowLeft, IconCircleArrowRight} from "@tabler/icons-react";
import ChatTrackView from "./chatTrackView";
import {GroupModel} from "../../../models/models";
import ShowCalendarView from "./showCalendarView";
import TrackConstructorView from "./trackConstructorView";
import {ChatConst} from "../chatConstants";

function ToreliChatMainView({
                                userAction,
                                scrollToBottomCallback,
                                updateActionCallback,
                                viewKey,
                                data
                            }: IChatViewProps) {
    const {ref: viewRef, height: viewHeight} = useElementSize()

    const tracksOnShow = useRef<boolean>(false)
    const groupOnShow = useRef<boolean>(false)

    const [trackActions, setTrackActions] = useState<IChatActionProps[]>([])
    const [groupActions, setGroupActions] = useState<IChatActionProps[]>([])

    //Обработка действий от пользователя пришедших через контекстное меню
    useEffect(() => {
        if (!userAction)
            return

        if (userAction.type === "show") {
            if (userAction.value === "tracks") {
                groupOnShow.current = false

                if (tracksOnShow.current) {
                    tracksOnShow.current = false
                    updateContextActions([showTrackAction(), showGroupAction(), showCalendarAction()])
                } else {
                    tracksOnShow.current = true
                    updateContextActions([showTrackAction(), createTrackAction(), ...trackActions])
                }
            }
            if (userAction.value === "groups") {
                tracksOnShow.current = false

                if (groupOnShow.current) {
                    groupOnShow.current = false
                    updateContextActions([showTrackAction(), showGroupAction(), showCalendarAction()])
                } else {
                    groupOnShow.current = true
                    updateContextActions([showGroupAction(), ...groupActions])
                }
            }
        }
    }, [userAction])

    //Промотка чата вниз
    useEffect(() => {
        scrollToBottomCallback!()
    }, [viewHeight])

    useEffect(() => {
        setTrackActions((data.trackSelector() as TrackViewModel[]).map(track => {
            return {
                color: cs.getTrackColor(track),
                text: cs.findTrackName(track),
                actions: [{
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
        }))
        setGroupActions((data.groupSelector() as GroupModel[]).map(group => {
            return {
                color: "blue",
                text: group.name,
                actions: [{
                    type: ChatActionType.ChangeView,
                    value: {
                        view: () => <div>{group.name}</div>
                    }
                }]
            }
        }))
        updateContextActions([showTrackAction(), showGroupAction(), showCalendarAction()])
    }, [])

    return <div
        ref={viewRef}
        style={{width: `${ChatConst.baseChatMessageSize}`}}>
        <Text size="sm">Добро пожаловать, {data.userName}!</Text>
        <Text size="sm">Приступим?</Text>
    </div>

    function updateContextActions(actions: IChatActionProps[]) {
        updateActionCallback(viewKey, actions)
    }

    function showTrackAction(): IChatActionProps {
        return {
            color: "green",
            text: "Треки",
            actions: [{
                type: ChatActionType.SendToView,
                value: {
                    type: "show",
                    value: "tracks"
                },
                //todo подумать о переносе в тип (ChatActionType котоырй маппится в ChatActionCallback.SendToView
                customIcon: tracksOnShow.current ? <IconCircleArrowLeft size={18}/> :
                    <IconCircleArrowRight size={18}/>,
            }]
        }
    }

    function showGroupAction(): IChatActionProps {
        return {
            color: "blue",
            text: "Группы",
            disabled: true,
            actions: [{
                type: ChatActionType.SendToView,
                value: {
                    type: "show",
                    value: "groups"
                },
                customIcon: groupOnShow.current ? <IconCircleArrowLeft size={18}/> :
                    <IconCircleArrowRight size={18}/>,
            }]
        }
    }

    function createTrackAction(): IChatActionProps {
        return {
            color: "green",
            text: "Создать трек",
            actions: [{
                type: ChatActionType.ChangeView,
                value: {view: (props) => <TrackConstructorView  {...props}/>},
            }]
        }
    }

    function showCalendarAction(): IChatActionProps {
        return {
            color: "blue",
            text: "Просмотр",
            actions: [{
                type: ChatActionType.ChangeView,
                value: {
                    view: (props) => <ShowCalendarView {...props} data={{
                        yearCount: data.yearCount,
                        startYear: data.startYear,
                        width: data.width,
                        height: data.height,
                        trackSelector: data.trackSelector
                    }}/>
                }
            }]
        }
    }
}


export default observer(ToreliChatMainView)
