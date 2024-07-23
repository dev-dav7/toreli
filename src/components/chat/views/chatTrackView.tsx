import React, {useEffect, useRef, useState} from "react";
import {IChatViewProps} from "../models/IChatViewProps";
import TrackView from "../../track/trackingView/TrackView";
import {TrackFillModel, TrackViewModel} from "../../../models/trackingModels";
import {ActionIcon, Box, Flex, LoadingOverlay, Text, Transition} from "@mantine/core";
import {trackControlStore as cs} from "../../../store/trackControlStore";
import {IChatActionProps} from "../models/IChatActionProps";
import {useElementSize} from "@mantine/hooks";
import {
    IconChevronLeft,
    IconChevronRight,
    IconCircleArrowLeft,
    IconCircleArrowRight,
    IconCircleArrowUp
} from "@tabler/icons-react";
import {DateInput} from "@mantine/dates";
import {dateStore} from "../../../store/dateStore";
import {trackStorageStore as ts} from "../../../store/trackStorageStore";
import TrackingService from "../../../sevices/trackingService";
import ErrorText from "../../utility/ErrorText";
import {observer} from "mobx-react-lite";
import {ChatActionType} from "../models/ChatActionType";
import TrackFillEditorView from "./trackFillEditorView";
import {ChatConst} from "../chatConstants";

function ChatTrackView({userAction, scrollToBottomCallback, updateActionCallback, viewKey, data}: IChatViewProps) {
    const {ref: viewRef, height: viewHeight} = useElementSize()
    const tracksOnShow = useRef<boolean>(false)
    const [switchTrackActions, setSwitchTrackActions] = useState<IChatActionProps[]>([])

    const [track, setTrack] = useState<TrackViewModel>(data.track)
    const [yearCount, setYearCount] = useState<number>(0)
    const [startYear, setStartYear] = useState<number>(2024)
    const [selectedDay, setSelectedDay] = useState<number>(0)

    const [minDate, setMinDate] = useState<Date>(new Date())
    const [maxDate, setMaxDate] = useState<Date>(new Date())

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [dataLoadError, setDataLoadError] = useState<string>("")

    const emptyValue = [{values: [], id: 0}]
    const emptyFill = {
        day: -1,
        dayE: -1,
        values: emptyValue
    }

    const [trackFill, setTrackFill] = useState<TrackFillModel>(emptyFill)

    //Обработка действий от пользователя пришедших через контекстное меню
    useEffect(() => {
        if (!userAction)
            return

        if (userAction.type === "switch-track") {
            if (track.id !== userAction.value.id) {
                setTrack(userAction.value as TrackViewModel)
                setTrackFill(emptyFill)

            }
        }

        if (userAction.type === "show") {
            if (userAction.value === "tracks") {
                if (tracksOnShow.current) {
                    tracksOnShow.current = false
                    updateContextActions([showTrackAction(), fillEditAction()])
                } else {
                    tracksOnShow.current = true
                    updateContextActions([showTrackAction(), fillEditAction(),...switchTrackActions])
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
        setSelectedDay(dateStore.getDay(new Date(), (data.startYear)))

        setYearCount(data.yearCount as number)
        setStartYear(data.startYear as number)
        setMinDate(new Date(startYear, 0, 1))
        setMaxDate(new Date(startYear + yearCount, 0, 1))

        updateContextActions([showTrackAction(), fillEditAction(), ...switchActions])
    }, [])


    useEffect(() => {
        if (selectedDay === 0)
            return

        if (dayInTrackFill())
            return

        setIsLoading(true)
        setDataLoadError("")
        TrackingService.findTrackFill(track.id, selectedDay)
            .then(r => {
                if (!r.data || r.data.values === null || r.data.values.length === 0)
                    setTrackFill(emptyFill)
                else
                    setTrackFill(r.data)
            })
            .catch(error => setDataLoadError(error))
            .finally(() => setIsLoading(false))
    }, [selectedDay, track])

    const dayInTrackFill = () => trackFill.day <= selectedDay && selectedDay <= trackFill.dayE

    return <div
        ref={viewRef}
        style={{width: `${ChatConst.baseChatMessageSize}`}}>
        <Text size={"sm"} ta={"center"}>Наблюдение за треком</Text>
        <Flex
            wrap="wrap-reverse"
            gap={5}
            mt={5}
            justify={{sm: 'center'}}
            align="flex-start"
            direction="row">
            <DateInput
                w={300}
                variant={"filled"}
                locale="ru"
                placeholder="Выбрать день"
                size={"sm"}
                value={dateStore.getDate(selectedDay, startYear)}
                minDate={minDate}
                maxDate={maxDate}
                onChange={onDateChange}
                leftSection={<ActionIcon variant="subtle"
                                         color={"gray"}
                                         radius={5}
                                         onClick={() => setSelectedDay(selectedDay - 1)}>
                    <IconChevronLeft/>
                </ActionIcon>}
                rightSection={<ActionIcon variant="subtle"
                                          color={"gray"}
                                          radius={5}
                                          onClick={() => setSelectedDay(selectedDay + 1)}>
                    <IconChevronRight/>
                </ActionIcon>}/>
        </Flex>
        {renderData()}
    </div>

    function onDateChange(e: any) {
        if (e !== null)
            setSelectedDay(dateStore.getDay(e as Date, startYear))
    }

    function renderData() {
        return <div>
            <ErrorText text={dataLoadError} size={"xs"}/>
            <Box pos="relative" style={{marginTop: "5px", marginBottom: "5px"}}>
                <Transition
                    mounted={isLoading}
                    transition="fade"
                    duration={400}
                    timingFunction="ease">
                    {(styles: any) =>
                        <LoadingOverlay visible={isLoading || dataLoadError !== ""}
                                        zIndex={1000}
                                        overlayProps={{radius: "sm", blur: 1}}
                                        loaderProps={{color: cs.getTrackColor(track)}}
                                        style={styles}/>
                    }</Transition>
                <TrackView
                    track={track}
                    values={trackFill.values}
                    key={track.id}
                    onShow={false}
                    appendValueCallback={() => {
                        cs.appendValues(track, trackFill.values)
                        setTrackFill({
                            day: trackFill.day,
                            dayE: trackFill.dayE,
                            values: trackFill.values,
                        })
                    }}
                    removeValueCallback={(id: number) =>
                        setTrackFill({
                            day: trackFill.day,
                            dayE: trackFill.dayE,
                            values: trackFill.values.filter(x => x.id !== id)
                        })}
                    saveCallback={() => {
                        ts.pushForSave({
                            trackId: track.id,
                            day: selectedDay,
                            value: trackFill.values
                        })
                        setTrackFill({
                            day: selectedDay,
                            dayE: selectedDay,
                            values: trackFill.values
                        })
                    }}
                />
            </Box>
        </div>
    }

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
                //todo подумать о переносе в тип (ChatActionType котоырй маппится в ChatActionCallback.SendToView
                customIcon: tracksOnShow.current ? <IconCircleArrowLeft size={18}/> :
                    <IconCircleArrowRight size={18}/>,
            }]
        }
    }

    function fillEditAction(): IChatActionProps {
        return {
            color: "orange",
            text: "Редактор заполнения",
            actions: [{
                type: ChatActionType.ChangeView,
                value: {
                    view: (props) => <TrackFillEditorView {...props} data={{
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
    }
}

export default observer(ChatTrackView)
