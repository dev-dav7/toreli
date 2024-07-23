import React, {useEffect, useState} from "react";
import {Box, Button, ComboboxItem, Container, LoadingOverlay, ScrollArea, Select, Text} from '@mantine/core';
import {trackControlStore as cs} from "../../../store/trackControlStore";
import {dateStore as ds, dateStore} from "../../../store/dateStore";
import {SetValueResponse, TrackFillModel, TrackValue, TrackViewModel} from "../../../models/trackingModels";
import Title from "../../utility/Title";
import {GroupModel} from "../../../models/models";
import TrackView from "../trackingView/TrackView";
import {DateInput} from "@mantine/dates";
import TrackingService from "../../../sevices/trackingService";
import ErrorText from "../../utility/ErrorText";
import ChatCarousel from "../../chat/chatCarousel";
import {ChatConst} from "../../chat/chatConstants";

interface ITrackValuesEditorProps {
    tracks: TrackViewModel[]
    groups: GroupModel[]
    startYear: number
    updateValuesCallback: (trackId: number, newValue: SetValueResponse) => void,
    minDate: Date,
    maxDate: Date,
    preSelectedTrack?: TrackViewModel,
}

function TrackValuesEditorView({
                                   tracks,
                                   groups,
                                   startYear,
                                   updateValuesCallback,
                                   maxDate,
                                   minDate,
                                   preSelectedTrack
                               }: ITrackValuesEditorProps) {
    const [comboboxSelectedTrack, setComboboxSelectedTrack] = useState<ComboboxItem>()
    const [comboboxTracks, setComboboxTracks] = useState<any[]>([])

    const [trackValues, setTrackValues] = useState<TrackValue[]>([])
    const [selectedTrack, setSelectedTrack] = useState<TrackViewModel | undefined>(preSelectedTrack)

    const [from, setFrom] = useState<Date | null>(null)
    const [to, setTo] = useState<Date | null>(null)

    const [isFillsLoading, setIsFillsLoading] = useState<boolean>(false)
    const [fillLoadingError, setFillLoadingError] = useState<string>("")

    const [selectedTrackFills, setSelectedTrackFills] = useState<TrackFillModel[]>([])

    const [fillValuesIsLoading, setFillValuesIsLoading] = useState<boolean>(false)
    const [fillValuesError, setFillValuesError] = useState<string>("")

    useEffect(() => {
        const result = groups.map((g) =>
            ({
                group: g.name,
                items: tracks.filter(t => t.groupId === g.id).map(t => ({label: cs.findTrackName(t), value: `${t.id}`}))
            }))
        result.push({
            group: "треки вне групп",
            items: tracks.filter(t => t.groupId === null).map(t => ({label: cs.findTrackName(t), value: `${t.id}`}))
        })
        setComboboxTracks(result)
    }, [tracks])

    useEffect(() => {
        if (comboboxSelectedTrack !== undefined) {
            const track = tracks.filter(t => t.id === Number.parseInt(comboboxSelectedTrack.value))[0]
            setTrack(track)
        }
    }, [comboboxSelectedTrack])

    useEffect(() => {
        if (preSelectedTrack !== undefined)
            setTrack(preSelectedTrack)

    }, [preSelectedTrack])

    return <ChatCarousel slides={[currenFillSlide(), editorSlide()]}/>

    function setTrack(track: TrackViewModel) {
        setSelectedTrack(track)
        setIsFillsLoading(true)
        setFillLoadingError("")
        TrackingService.getValuesByTrackId(track.id)
            .then(x => {
                setSelectedTrackFills(x.data.values.sort((a, b) => a.day - b.day))
                setFillLoadingError("")
            })
            .catch(error => setFillLoadingError(error))
            .finally(() => {
                setIsFillsLoading(false)
            })

        setTrackValues([{
            values: [],
            id: 0
        }])
    }

    function fillAction() {
        if (selectedTrack === undefined) {
            setFillValuesError("Не выбран трек")
        }

        const trackId = (selectedTrack as TrackViewModel).id
        let newData: SetValueResponse
        setFillValuesIsLoading(true)
        setFillValuesError("")
        TrackingService.fillValue(trackId, ds.getDay(from as Date, startYear), ds.getDay(to as Date, startYear), trackValues)
            .then(r => {
                //todo что если поменяют трек во время обновления и данные успеют загрузиться раньше
                setSelectedTrackFills(selectedTrackFills
                    .filter(x => x.day < r.data.removeFrom || x.dayE > r.data.removeTo)
                    .concat(r.data.add)
                    .sort(x => x.day))
                newData = r.data
            })
            .catch(error => setFillValuesError(error))
            .finally(() => {
                setFillValuesIsLoading(false)
                updateValuesCallback(trackId, newData)
            })
    }

    function getTrackColor() {
        const color = selectedTrack === undefined ? undefined : cs.getTrackColor(selectedTrack)
        if (color === undefined)
            return "blue"
        return color
    }

    function currenFillSlide() {
        return <div style={{width: ChatConst.baseChatMessageSize}}>
            <Title text="текущие заполнения"/>
            <Box pos="relative">
                <LoadingOverlay visible={isFillsLoading} zIndex={1000}
                                overlayProps={{radius: "sm", blur: 1}}
                                loaderProps={{color: getTrackColor()}}/>
                <ErrorText text={fillLoadingError}/>
                <ScrollArea.Autosize offsetScrollbars type="always" scrollbars="y" mah="250px">
                    {selectedTrackFills
                        .map(x => {
                            const dFrom = dateStore.getDate(x.day, startYear)
                            const dTo = dateStore.getDate(x.dayE, startYear)
                            return <Container key={`${x.day}`}
                                              onClick={() => {
                                                  setFrom(dFrom)
                                                  setTo(dTo)
                                                  setTrackValues(x.values)
                                              }}
                                              style={{
                                                  borderRadius: "5px",
                                                  border: "1px solid lightgray",
                                                  marginBottom: "5px",
                                                  backgroundColor: "white",
                                              }}>
                                <Text ta="center">{dFrom.toLocaleDateString()}-{dTo.toLocaleDateString()}</Text>
                            </Container>
                        })}
                </ScrollArea.Autosize>
            </Box>
        </div>
    }

    function editorSlide() {
        return <div style={{width: ChatConst.baseChatMessageSize}}>
            <Title text="редактор заполнения"/>
            <Select
                mt={5}
                data={comboboxTracks}
                allowDeselect={false}
                onChange={(_value, option) => setComboboxSelectedTrack(option)}
                searchable
                placeholder={"Выбрать трек"}
                value={`${selectedTrack?.id}`}
                disabled={isFillsLoading}/>
            <Box pos="relative">
                <LoadingOverlay visible={fillValuesIsLoading} zIndex={1000}
                                overlayProps={{radius: "sm", blur: 1}}
                                loaderProps={{color: getTrackColor()}}/>
                <div>
                    <DateInput
                        mt={10}
                        locale="ru"
                        w="200px"
                        placeholder="Дата от"
                        value={from}
                        minDate={minDate}
                        maxDate={maxDate}
                        onChange={(e) => setFrom(e)}/>
                    <DateInput
                        mt={10}
                        locale="ru"
                        w="200px"
                        placeholder="Дата до"
                        value={to}
                        minDate={minDate}
                        maxDate={maxDate}
                        onChange={(e) => setTo(e)}/>
                    <div style={{display: "flex", justifyContent: "right"}}>
                        <Button variant="transparent" color="gray" size="compact-xs"
                                onClick={() => {
                                    setTrackValues([{
                                        values: [],
                                        id: 0
                                    }])
                                }}
                                disabled={fillValuesIsLoading}>
                            очистить заполнение
                        </Button>
                    </div>
                    {selectedTrack !== undefined &&
                    <div style={{marginTop: "5px"}}>
                        <TrackView
                            values={trackValues}
                            track={selectedTrack}
                            appendValueCallback={() => {
                                cs.appendValues(selectedTrack, trackValues)
                                setTrackValues(trackValues.filter(() => true))
                            }}
                            removeValueCallback={(id: number) => setTrackValues(trackValues.filter(x => x.id !== id))}
                            onShow={false}
                            saveCallback={() => setTrackValues(trackValues.filter(() => true))}/>

                    </div>}
                </div>
            </Box>
            <div style={{marginTop: "10px"}}>
                <ErrorText text={fillValuesError}/>
                <Button
                    fullWidth
                    onClick={fillAction}
                    color={getTrackColor()}
                    disabled={
                        fillValuesIsLoading ||
                        selectedTrack === undefined ||
                        from === null ||
                        to === null}>
                    {trackValues.some(x => x.values.length > 0) ? "заполнить диапазон" : "очистить диапазон"}
                </Button>
            </div>
        </div>
    }
}

export default React.memo(TrackValuesEditorView)