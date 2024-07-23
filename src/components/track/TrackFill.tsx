import {observer} from "mobx-react-lite";
import React, {useEffect, useState} from "react";
import {Accordion, ActionIcon, Button, Container, Flex, ScrollArea, Text, Tooltip,} from '@mantine/core';
import {mainStore} from "../../store/mainStore";
import {trackControlStore as cs} from "../../store/trackControlStore";
import {DateInput} from "@mantine/dates";
import 'dayjs/locale/ru';
import {IconChevronDown, IconChevronLeft, IconChevronRight, IconChevronUp, IconX} from "@tabler/icons-react";
import DataTrackPreview from "./DataTrackPreview";
import {trackStorageStore as ts} from "../../store/trackStorageStore";
import TrackView from "./trackingView/TrackView";
import {TrackViewModel} from "../../models/trackingModels";

function TrackFill() {
    const [fillIndexes, setFillIndexes] = useState<number[]>([])

    useEffect(() => {
        const buildFills: number[] = []
        ts.tracks.forEach((x) => {
            const valuesForDay = ts.getValuesForDay(mainStore.selectedDay, x)
            if (valuesForDay.some(x => x.values.length > 0))
                buildFills.push(x.id)
        })
        setFillIndexes(buildFills)
    }, [mainStore.selectedDay, ts.valueIterator])

    return <div style={{minWidth: "350px", height: "100%"}}>
        <div style={{display: "flex"}}>
            <div style={{minWidth: "350px", width: "350px", marginTop: "5px"}}>
                <Flex align="flex-end">
                    <Button variant="transparent" color="gray" size="compact-xs" ml="auto" mr="0px" p="0px"
                            onClick={() => mainStore.setSelectedDate(new Date())}
                            style={{float: "right"}}>
                        открыть сегодня
                    </Button>
                </Flex>
                <Flex
                    wrap="wrap-reverse"
                    gap="xs"
                    justify={{sm: 'center'}}
                    align="flex-start"
                    direction="row"
                    mt={5}>
                    <Tooltip
                        label={"На 1 день назад"}
                        offset={5}
                        arrowOffset={25} arrowSize={10}
                        openDelay={1000}
                        withArrow position="top-start">
                        <div>
                            <ActionIcon variant="default"
                                        onClick={() => mainStore.setSelectedDay(mainStore.selectedDay - 1)}>
                                <IconChevronLeft size={"100%"}/>
                            </ActionIcon>
                        </div>
                    </Tooltip>
                    <DateInput
                        locale="ru"
                        w="200px"
                        placeholder="Выбрать день"
                        value={mainStore.selectedDate}
                        minDate={mainStore.minDate}
                        maxDate={mainStore.maxDate}
                        onChange={onDateChange}
                    />
                    <Tooltip
                        label={"На 1 день вперёд"}
                        offset={5}
                        arrowOffset={25} arrowSize={10}
                        openDelay={1000}
                        withArrow position="top-start">
                        <div>
                            <ActionIcon variant="default"
                                        onClick={() => mainStore.setSelectedDay(mainStore.selectedDay + 1)}>
                                <IconChevronRight size={"100%"}/>
                            </ActionIcon>
                        </div>
                    </Tooltip>
                </Flex>
            </div>
            {/*//todo пока в строку, надо в набор типа таблички*/}
            <Flex mt="5px" style={{alignContent: "center"}}>
                {fillIndexes.map((x) => <DataTrackPreview fillInStoreIndex={x} key={x}/>)}
            </Flex>
        </div>
        <div style={{display: "flex", margin: "0"}}>
            <div style={{minWidth: "350px", maxWidth: "350px"}}>
                {ts.isInit &&
                <ScrollArea scrollbars="y" offsetScrollbars type="always"
                            style={{
                                position: "relative",
                                height: "600px",
                                paddingRight: "5px"
                            }}>
                    {renderGroups()}
                </ScrollArea>}
            </div>
            <div style={{minWidth: "300px"}}>
                <Text ta="center" color="gray.7">отображаемые треки</Text>
                <ScrollArea scrollbars="y" offsetScrollbars type="always"
                            style={{
                                position: "relative",
                                height: "600px",
                                paddingRight: "5px"
                            }}>
                    {mainStore.tracksForShow.map(x => {
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
                                                    onClick={() => addTrackForShow(x)}
                                                    color={cs.getTrackColor(x)}>
                                            <IconX size={"100%"}/>
                                        </ActionIcon>
                                    </Tooltip>
                                    <ActionIcon variant="light"
                                                size="xs"
                                                radius={5} color={cs.getTrackColor(x)}
                                                onClick={() => upTrackForShow(x)}>
                                        <IconChevronUp size={"100%"}/>
                                    </ActionIcon>
                                    <ActionIcon variant="light"
                                                size="xs"
                                                radius={5}
                                                color={cs.getTrackColor(x)}
                                                onClick={() => downTrackForShow(x)}>
                                        <IconChevronDown size={"100%"}/>
                                    </ActionIcon>
                                </ActionIcon.Group>
                                <Text ml={5} size={"sm"}>{cs.findTrackName(x)}</Text>
                            </Flex>
                        </Container>
                    })}
                </ScrollArea>
            </div>
        </div>
    </div>

    function onDateChange(e: any) {
        if (e !== null)
            mainStore.setSelectedDate(e)
    }

    function renderGroups() {
        return <Accordion multiple={true} radius="xs" defaultValue={["not_in_group"]}
                          styles={{label: {padding: '5px'}}}>
            {ts.groups.map((g) =>
                <Accordion.Item key={g.id} value={g.name}>
                    {renderGroup(g.id, g.name)}
                </Accordion.Item>)}
            <Accordion.Item key={0} value={"not_in_group"}>
                {renderGroup(null, "треки вне групп")}
            </Accordion.Item>
        </Accordion>
    }

    function renderGroup(id: number | null, name: string) {
        return <>
            <Accordion.Control>
                <div style={{position: "relative"}}>
                    <Text>
                        {name}
                    </Text>
                    <Text size={"xs"}
                          color={"gray"}
                          style={{
                              position: "absolute",
                              right: "0",
                              top: "50%",
                              marginTop: "-0.625em"
                          }}>
                        {ts.tracks.filter(x => x.groupId === id).length}
                    </Text>
                </div>
            </Accordion.Control>
            <Accordion.Panel>{renderGroupTracks(id)}</Accordion.Panel>
        </>
    }

    function renderGroupTracks(groupId: number | null) {
        return <>
            {ts.tracks.filter(x => x.groupId === groupId).map((x) => {
                const trackValues = ts.getValuesForDay(mainStore.selectedDay, x)
                return <TrackView
                    track={x}
                    values={trackValues}
                    key={x.id}
                    appendValueCallback={() => cs.appendValues(x, trackValues)}
                    removeValueCallback={(id: number) => {
                        const newValue = ts.removeValuesForDay(mainStore.selectedDay, x, id)
                        ts.pushForSave({
                            trackId: x.id,
                            day: mainStore.selectedDay,
                            value: newValue
                        })
                    }}
                    saveCallback={() => {
                        ts.pushForSave({
                            trackId: x.id,
                            day: mainStore.selectedDay,
                            value: trackValues
                        })
                    }}
                    showCallback={() => addTrackForShow(x)}
                    onShow={mainStore.tracksForShow.some(showTrack => showTrack.id === x.id)}
                />
            })}
        </>
    }

    function addTrackForShow(track: TrackViewModel) {
        mainStore.addTrackForShow(track)
    }

    function upTrackForShow(track: TrackViewModel) {
        mainStore.moveTrackForShowUp(track)
    }

    function downTrackForShow(track: TrackViewModel) {
        mainStore.moveTrackForShowDown(track)
    }

}

export default observer(TrackFill);