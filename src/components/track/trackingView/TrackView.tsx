import {observer} from "mobx-react-lite";
import React, {useState} from "react";
import {ActionIcon, Container, Flex, Spoiler, Text, Tooltip} from '@mantine/core';
import {TrackingModelParameter, TrackValue, TrackViewModel} from "../../../models/trackingModels";
import {IconCopyMinus, IconEye, IconEyeOff, IconPlus, IconX} from "@tabler/icons-react";
import TrackEntryView from "./TrackEntryView";
import {trackControlStore as cs} from "../../../store/trackControlStore";

export interface ITrackViewProps {
    track: TrackViewModel
    values: TrackValue[]
    removeValueCallback?: (id: number) => void
    appendValueCallback?: () => void
    saveCallback?: () => void
    showCallback?: () => void
    onShow: boolean
}

function TrackView({
                       track,
                       values,
                       removeValueCallback,
                       saveCallback,
                       showCallback,
                       onShow,
                       appendValueCallback
                   }: ITrackViewProps) {
    const [isHover, setIsHover] = useState(false)
    const [isInRemoveMode, setIsInRemovedMode] = useState(false)
    const color = cs.getTrackColor(track)
    const listView = cs.getTrackParameter(track, TrackingModelParameter.List) as boolean
    const trackName = track.params.get(TrackingModelParameter.Name)

    const handleMouseEnter = () => setIsHover(true)
    const handleMouseLeave = () => setIsHover(false)

    return <Container pl="3px" pr="0px" pb="3px" m={0} mb={5}
                      w="300px" mih="25px"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      style={{
                          backgroundColor: "whitesmoke",
                          border: "1px solid lightgray",
                          borderRadius: "5px",
                          background: `linear-gradient(90deg, ${color} 0px,rgba(255,255,255,1)  ${(!isHover ? "2px" : "4px")})`,
                      }}>
        <Spoiler maxHeight={200} showLabel="раскрыть" hideLabel="свернуть"
                 styles={{control: {color: 'gray', paddingTop: '5px', fontSize: '14px'}}}>
            <Flex style={{position: "relative"}}>
                <div style={{zIndex: "99", width: "100%"}}>
                    {trackName &&
                    <Text size="sm" ta="center" pt={3}>
                        {trackName}
                    </Text>}
                    {renderOptions()}
                </div>
                <div style={{
                    zIndex: "100",
                    position: "absolute",
                    right: "0",
                    top: "0",
                }}>
                    {topActionButton()}
                </div>
            </Flex>
        </Spoiler>
        {bottomActionButton()}
    </Container>

    function renderOptions() {
        return getValuesForRender().map((value) =>
            <TrackEntryView
                track={track}
                values={value}
                key={value.id}
                isInRemoveMode={isInRemoveMode && cs.getTrackParameter(track, TrackingModelParameter.List)}
                removeValueCallback={removeValueCallback}
                saveCallback={saveCallback}
            />)
    }

    function getValuesForRender() {
        if (cs.getTrackParameter(track, TrackingModelParameter.List) || values.length === 0)
            return values
        return [values[0]]
    }

    function topActionButton() {
        return <ActionIcon.Group orientation="horizontal" pt={3} mr={3}>
            {showCallback &&
            <Tooltip
                label={onShow ? "Убрать из отображаемых" : "Добавить в отображаемые"}
                offset={5}
                arrowOffset={25} arrowSize={10}
                openDelay={1000}
                withArrow position="top-start">
                <ActionIcon variant="filled"
                            size="xs"
                            radius={5}
                            onClick={showCallback}
                            color={color}>
                    {onShow
                        ? <IconEyeOff size={"80%"}/>
                        : <IconEye size={"80%"}/>
                    }
                </ActionIcon>
            </Tooltip>}
        </ActionIcon.Group>
    }

    function bottomActionButton() {
        return <>
            {listView &&
            <Flex justify="flex-end">
                <ActionIcon.Group orientation="horizontal">
                    <Tooltip
                        label={cs.maxValuesCount > values.length ? "Добавить значение" : `Не больше ${cs.maxValuesCount} значений`}
                        offset={5}
                        arrowOffset={60} arrowSize={10}
                        openDelay={1000}
                        withArrow position="top-start">
                        <ActionIcon variant="subtle"
                                    color="gray"
                                    size="compact-md"
                                    p={5}
                                    disabled={values.length >= cs.maxValuesCount}
                                    radius={4}
                                    onClick={appendValueCallback}>
                            <IconPlus size={12}/>
                        </ActionIcon>
                    </Tooltip>
                    <Tooltip
                        label={isInRemoveMode ? "Закрыть кнопки удаления" : "Открыть кнопки удаления"}
                        offset={5}
                        arrowOffset={85} arrowSize={10}
                        openDelay={1000}
                        withArrow position="top-start">
                        <ActionIcon variant="subtle"
                                    color="gray"
                                    size="compact-md"
                                    radius={5}
                                    p={4}
                                    onClick={() => setIsInRemovedMode(!isInRemoveMode)}>
                            {isInRemoveMode
                                ? <IconX size={12}/>
                                : <IconCopyMinus size={12}/>
                            }
                        </ActionIcon>
                    </Tooltip>
                </ActionIcon.Group>
            </Flex>}
        </>
    }
}

export default observer(TrackView)