import {observer} from "mobx-react-lite";
import React, {useState} from "react";
import {
    ActionIcon,
    Button,
    Checkbox,
    CloseButton,
    ColorInput,
    ComboboxItem,
    Flex,
    rem,
    Select,
    Text,
    TextInput,
    Tooltip,
} from '@mantine/core';
import {
    TrackingModelParameter,
    TrackingOptionParameter,
    TrackingType,
    TrackingTypeItems,
    TrackTypeDefaultValue,
} from "../../../models/trackingModels";
import {IconFocus2, IconPlus} from "@tabler/icons-react";
import OptionDesign from "./OptionDesign";
import TrackDesignStore from "../../../store/trackDesignStore";
import {trackControlStore as cs} from "../../../store/trackControlStore";
import {trackStorageStore as ts} from "../../../store/trackStorageStore";
import {runInAction} from "mobx";
import TrackingService from "../../../sevices/trackingService";
import Title from "../../utility/Title";
import ErrorText from "../../utility/ErrorText";
import SuccessText from "../../utility/SuccessText";
import TrackView from "../trackingView/TrackView";
import ChatCarousel from "../../chat/chatCarousel";

function TrackDesignView() {
    const [ds] = useState<TrackDesignStore>(new TrackDesignStore())

    const [error, setError] = useState<string>("")
    const [info, setInfo] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [lastSelectedColor, setLastSelectedColor] = useState<string>("#336600ff")
    const [selectedTrackingType, setSelectedTrackingType] = useState<ComboboxItem>(TrackTypeDefaultValue)

    const trackName = cs.getTrackParameter(ds.constructedTrack, TrackingModelParameter.Name)

    return <ChatCarousel slides={[previewSlide(), editorSlide()]}/>

    function previewSlide() {
        return <div style={{maxWidth: "325px", width: "325px"}}>
            <Title text="превью трека"/>
            <TrackView track={ds.constructedTrack}
                       values={ds.exampleValues}
                       key={ds.constructedTrack.id}
                       appendValueCallback={() =>
                           runInAction(() => cs.appendValues(ds.constructedTrack, ds.exampleValues))}
                       removeValueCallback={(idToRemove: number) =>
                           runInAction(() => ds.exampleValues = cs.removeValues(ds.exampleValues, idToRemove))}
                       onShow={false}/>
        </div>
    }

    function editorSlide() {
        return <>
            {defaultParams()}
            {additionalParams()}
            {optionEditor()}
            <ErrorText text={error}/>
            <SuccessText text={info}/>
            <Button fullWidth mt={10}
                    color={cs.getTrackColor(ds.constructedTrack)}
                    disabled={isSaveDisabled()}
                    loading={isLoading}
                    loaderProps={{type: 'dots'}}
                    onClick={createTrack}>
                создать
            </Button>
        </>
    }

    function isSaveDisabled(): boolean {
        if (ds.constructedTrack.viewOptions.length === 0)
            return true

        const optionsWithName = ds.constructedTrack.viewOptions.filter(x => cs.getOptionParameter(x, TrackingOptionParameter.Name).trim() !== "").length
        return cs.getTrackParameter(ds.constructedTrack, TrackingModelParameter.Name).trim() === "" && optionsWithName === 0
    }

    function createTrack() {
        setIsLoading(true)
        setError("")
        setInfo("")
        TrackingService.createTrack(ds.constructedTrack)
            .then(x => {
                const track = ts.restoreTrack(x.data)
                ts.addOrUpdateTrack(track)
                setInfo(`Трек ${cs.findTrackName(track)} успешно добавлен`)
                ds.flush()
                cs.setTrackParameter(ds.constructedTrack, TrackingModelParameter.Color, lastSelectedColor)
            })
            .catch(error => {
                    if (typeof error === "string")
                        setError(error)
                    else
                        setError("Непредвиденная ошибка, попробуйте повторть действие позже")
                }
            )
            .finally(() => {
                setIsLoading(false)
            })
    }

    function defaultParams() {
        return <>
            <Title text="параметры трека"/>
            <Text mt="5px" size="sm">
            </Text>
            <TextInput
                placeholder="название для трека"
                value={trackName}
                onChange={(event) => cs.setTrackParameter(ds.constructedTrack, TrackingModelParameter.Name, event.currentTarget.value)}
                rightSectionPointerEvents="all"
                maxLength={120}
                rightSection={
                    <CloseButton
                        aria-label="Clear input"
                        onClick={() => cs.setTrackParameter(ds.constructedTrack, TrackingModelParameter.Name, '')}
                        style={{display: trackName ? undefined : 'none'}}
                    />}
            />
            <Text mt="10px" size="sm">
            </Text>
            <ColorInput defaultValue="#336600ff" format="hexa"
                        eyeDropperIcon={<IconFocus2 style={{width: rem(18), height: rem(18)}} stroke={1.5}/>}
                        onChange={(e) => cs.setTrackParameter(ds.constructedTrack, TrackingModelParameter.Color, e)}
                        onChangeEnd={(e) => {
                            cs.setTrackParameter(ds.constructedTrack, TrackingModelParameter.Color, e)
                            setLastSelectedColor(e)
                        }}/>
        </>
    }

    function additionalParams() {
        return <div>
            <Select
                mt="xs"
                size="sm"
                placeholder="выбрать группу"
                data={ts.groups.map(x => ({value: x.id.toString(), label: x.name}))}
                disabled={!ts.groups || ts.groups.length === 0}
                clearable
                //todo в cs store
                onChange={(_value, option) => runInAction(() =>
                    ds.constructedTrack.groupId = option === null ? undefined : Number.parseInt(option.value))}/>
            <Tooltip
                offset={5}
                label="Позволяет создавать несколько однотипных записей внутри трека в рамках одного дня"
                multiline
                arrowOffset={5} arrowSize={10}
                openDelay={500}
                w={300}
                withArrow position="top-start">
                <Checkbox
                    mt={5}
                    size="sm"
                    color={cs.getTrackColor(ds.constructedTrack)}
                    variant="filled"
                    label="Список"
                    checked={cs.getTrackParameter(ds.constructedTrack, TrackingModelParameter.List)}
                    onChange={(event) => {
                        cs.setTrackParameter(ds.constructedTrack, TrackingModelParameter.List, event.currentTarget.checked)
                    }}
                />
            </Tooltip>
        </div>

    }

    function optionEditor() {
        return <div style={{marginTop: "5px"}}>
            <Title text="отслеживаемые параметры"/>
            <Flex gap={{base: 'sm', sm: 'lg'}}
                  justify="center"
                  align="center"
                  direction="row"
                  wrap="wrap">
                <Select
                    data={TrackingTypeItems}
                    allowDeselect={false}
                    onChange={(_value, option) => setSelectedTrackingType(option)}
                    value={selectedTrackingType.value}
                />
                <Tooltip
                    offset={5}
                    label={
                        ds.constructedTrack.viewOptions.length < ds.maxOptionsCount
                            ? "Добавить параметр для отслеживания"
                            : `\n Не больше ${ds.maxOptionsCount} параметров для отслеживания`
                    }
                    multiline
                    arrowOffset={25}
                    arrowSize={10}
                    openDelay={1000}
                    withArrow position="top-start">
                    <ActionIcon variant="filled" size="lg"
                                disabled={ds.constructedTrack.viewOptions.length > ds.maxOptionsCount}
                                onClick={() => ds.addOption(selectedTrackingType.value as TrackingType)}
                                color={cs.getTrackColor(ds.constructedTrack)}>
                        <IconPlus style={{width: '70%', height: '70%'}} stroke={1.5}/>
                    </ActionIcon>
                </Tooltip>
            </Flex>
            {ds.constructedTrack.viewOptions.map((x) => {
                const id = cs.getOptionParameter(x, TrackingOptionParameter.Id)
                return <OptionDesign key={id}
                                     color={cs.getTrackColor(ds.constructedTrack)}
                                     optionParams={x}
                                     moveUpOption={ds.moveUpOption}
                                     moveDownOption={ds.moveDownOption}
                                     removeOptions={ds.removeOptions}/>
            })}
        </div>
    }

}

export default observer(TrackDesignView)