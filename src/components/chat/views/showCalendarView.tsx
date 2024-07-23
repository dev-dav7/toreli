import React, {useEffect, useState} from "react";
import {observer} from "mobx-react-lite";
import {IChatViewProps} from "../models/IChatViewProps";
import {IChatActionProps} from "../models/IChatActionProps";
import {useElementSize} from "@mantine/hooks";
import {ActionIcon, Container, Flex, Text, Tooltip,} from '@mantine/core';
import {TrackViewModel} from "../../../models/trackingModels";
import {trackControlStore as cs} from "../../../store/trackControlStore";
import {ChatActionType} from "../models/ChatActionType";
import {IconChevronDown, IconChevronUp, IconX} from "@tabler/icons-react";
import {ChatConst} from "../chatConstants";
import ChatCarousel from "../chatCarousel";
import {Link} from "react-router-dom";

function ShowCalendarView({
                              userAction,
                              scrollToBottomCallback,
                              updateActionCallback,
                              viewKey,
                              chatHeight,
                              data
                          }: IChatViewProps) {
    const {ref: viewRef, height: viewHeight} = useElementSize()

    const [calendarWidth, setCalendarWidth] = useState<number>()
    const [calendarHeight, setCalendarHeight] = useState<number>()
    const [tracksShown, setTracksShown] = useState<TrackViewModel[]>([])

    //Обработка действий от пользователя пришедших через контекстное меню
    useEffect(() => {
        if (!userAction)
            return

        if (userAction.type === "track") {
            const track = userAction.value as TrackViewModel
            setTracksShown([track, ...(tracksShown.filter(x => x.id !== track.id))])
        }
    }, [userAction])

    useEffect(() => {
        scrollToBottomCallback!()
    }, [viewHeight])

    useEffect(() => {
        updateContextActions([])
    }, [])

    useEffect(() => {
        const height = chatHeight ?? 100
        const elemSize = (height - height % 100) / 100 * 0.98
        setCalendarWidth(elemSize * 52)
        setCalendarHeight(elemSize * 100)

        updateContextActions((data.trackSelector() as TrackViewModel[]).map(track => {
            return {
                color: cs.getTrackColor(track),
                text: cs.findTrackName(track),
                actions: [{
                    type: ChatActionType.SendToView,
                    value: {
                        type: "track",
                        value: track,
                    }
                }]
            }
        }))
    }, [])

    return <div ref={viewRef} style={{minWidth: calendarWidth}}>
        <Text size="sm" ta="center" mb={5}>Просмотр календаря</Text>
        <ChatCarousel slides={[
            // calendarSlide(),
            // trackMenu()
            notReadyPlaceholder()
        ]}/>
    </div>

    function calendarSlide() {
        return <div>
            <div
                style={{
                    width: `${calendarWidth}px`,
                    height: `${calendarHeight}px`,
                    backgroundColor: "whitesmoke",
                    border: `1px solid gray`
                }}
            />
        </div>
    }

    function trackMenu() {
        return <div
            style={{width: ChatConst.baseChatMessageSize, paddingLeft: "10px"}}>
            <Text size="sm">треки для отображения</Text>
            {tracksShown.map(x => {
                return <Container mb={3} pl={5} pr={5} pt={3} pb={3}
                                  style={{borderRadius: "5px"}}
                                  key={x.id}>
                    <Flex>
                        <ActionIcon.Group orientation="horizontal" pt={3} ml={5}>
                            <Tooltip label={"Убрать из отображения"}
                                     offset={5}
                                     multiline
                                     arrowOffset={5} arrowSize={10}
                                     openDelay={1000}
                                     withArrow position="top-start">
                                <ActionIcon variant="filled"
                                            size="xs"
                                            radius={5}
                                            color={cs.getTrackColor(x)}
                                            onClick={() => removeTrack(x)}>
                                    <IconX size={"100%"}/>
                                </ActionIcon>
                            </Tooltip>
                            <ActionIcon variant="light"
                                        size="xs"
                                        radius={5} color={cs.getTrackColor(x)}
                                        onClick={() => moveTrackForShowUp(x)}>
                                <IconChevronUp size={"100%"}/>
                            </ActionIcon>
                            <ActionIcon variant="light"
                                        size="xs"
                                        radius={5}
                                        color={cs.getTrackColor(x)}
                                        onClick={() => moveTrackForShowDown(x)}>
                                <IconChevronDown size={"100%"}/>
                            </ActionIcon>
                        </ActionIcon.Group>
                        <Text ml={5} size={"sm"}>{cs.findTrackName(x)}</Text>
                    </Flex>
                </Container>
            })}
        </div>
    }

    function notReadyPlaceholder() {
        return <div
            style={{maxWidth: ChatConst.baseChatMessageSize, paddingLeft: "10px"}}>
            <Text size="sm">Просмотр доступен в "полной" версии.</Text>
            <Link to={"/main"} target="_blank" size="sm">открыть</Link>
        </div>
    }

    function updateContextActions(actions: IChatActionProps[]) {
        updateActionCallback(viewKey, actions)
    }

    function removeTrack(track: TrackViewModel) {
        setTracksShown(tracksShown.filter(x => x.id !== track.id))
    }

    function moveTrackForShowUp(track: TrackViewModel) {
        const index = tracksShown.indexOf(track)

        if (index > 0) {
            const oldValues = tracksShown[index - 1]
            tracksShown.splice(index - 1, 2, track, oldValues)
            setTracksShown(tracksShown.filter(_ => true))
        }
    }

    function moveTrackForShowDown(track: TrackViewModel) {
        const index = tracksShown.indexOf(track)

        if (index < tracksShown.length - 1) {
            const oldValues = tracksShown[index + 1]
            tracksShown.splice(index, 2, oldValues, track)
            setTracksShown(tracksShown)
            setTracksShown(tracksShown.filter(_ => true))
        }
    }
}

export default observer(ShowCalendarView)
