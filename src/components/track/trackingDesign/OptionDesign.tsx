import {observer} from "mobx-react-lite";
import React from "react";
import {ActionIcon, Container, Flex, Menu, Radio, rem, Text, TextInput, Tooltip} from '@mantine/core';
import {TrackingOptionParameter, TrackingType, TrackingTypeNameRU} from "../../../models/trackingModels";
import {IOptionDesignProps} from "./IOptionDesignProps";
import DayTimeDesign from "./DayTimeDesign";
import CounterDesign from "./CounterDesign";
import CheckDesign from "./CheckDesign";
import NoteDesign from "./NoteDesign";
import {IconChevronDown, IconChevronUp, IconMenu2, IconTrash} from "@tabler/icons-react";
import {trackControlStore as cs} from "../../../store/trackControlStore";

function OptionDesign(props: IOptionDesignProps) {
    const DesignByType: { [key in TrackingType]: JSX.Element } = {
        Note: <NoteDesign {...props}/>,
        Check: <CheckDesign {...props}/>,
        Counter: <CounterDesign {...props}/>,
        DayTime: <DayTimeDesign {...props}/>,
    };

    const option = props.optionParams
    const type = cs.getOptionParameter(option, TrackingOptionParameter.Type) as TrackingType

    return <Container w={280} p={6} mt="10px" bg='#e8e8e854'>
        <Flex gap="0px">
            {TrackingTypeNameRU[type]}
            {elementOptionMenu()}
        </Flex>
        <Container p="5px" m="0px">
            <Text size="xs">название</Text>
            <TextInput
                size="xs"
                placeholder="Название"
                maxLength={33}
                value={option.get(TrackingOptionParameter.Name).value}
                onChange={(event) => cs.setOptionParameter(option, TrackingOptionParameter.Name, event.currentTarget.value)}
                rightSection={nameOptionMenu()}
            />
            {DesignByType[type]}
        </Container>
    </Container>

    function elementOptionMenu() {
        return <>
            <Menu shadow="md"
                  position="right">
                <Menu.Target>
                    <Tooltip
                        label={"Размер и вид"}
                        offset={5}
                        arrowOffset={25} arrowSize={10}
                        openDelay={1000}
                        withArrow>
                        <ActionIcon variant="transparent" color="gray"
                                    mr="0" ml="auto" size="xs"
                                    radius="md">
                            <IconMenu2 size={"80%"}/>
                        </ActionIcon>
                    </Tooltip>
                </Menu.Target>
                <Menu.Dropdown>
                    <Menu.Label>Размер</Menu.Label>
                    <Radio.Group
                        onChange={(e) => cs.setOptionParameter(option, TrackingOptionParameter.ElementSize, e)}
                        value={cs.getOptionParameter(option, TrackingOptionParameter.ElementSize)}>
                        <Radio
                            color="gray"
                            variant="outline" size="xs" label="Очень маленький" value="xs"/>
                        <Radio
                            mt={5}
                            color="gray"
                            variant="outline" size="xs" label="Маленький" value="sm"/>
                        <Radio
                            mt={5}
                            color="gray"
                            variant="outline" size="xs" label="Средний" value="md"/>
                        <Radio
                            mt={5}
                            color="gray"
                            variant="outline" size="xs" label="Большой" value="lg"/>
                        <Radio
                            mt={5}
                            color="gray"
                            variant="outline" size="xs" label="Очень большой" value="xl"/>
                    </Radio.Group>
                    <>
                        <Menu.Label>Вид</Menu.Label>
                        <Radio.Group
                            onChange={(e) => cs.setOptionParameter(option, TrackingOptionParameter.Style, e)}
                            value={cs.getOptionParameter(option, TrackingOptionParameter.Style)}>
                            <Radio
                                color="gray"
                                variant="outline" size="xs"
                                label="С заливкой"
                                value="filled"
                            />
                            <Radio
                                mt={5}
                                color="gray"
                                variant="outline"
                                size="xs"
                                label="Без заливки"
                                value={TrackingType.Check === type ? "outline" : "default"}/>
                        </Radio.Group>
                    </>
                    <Menu.Divider/>
                    <Menu.Item p={2}
                               onClick={() => props.removeOptions(cs.getOptionParameter(option, TrackingOptionParameter.Id))}
                               leftSection={<IconTrash style={{width: rem(14), height: rem(14)}}/>}>
                        <Text size={"xs"} ml={3}>Удалить</Text>
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>
            <ActionIcon variant="transparent" mr="0" size="xs" color="gray"
                        onClick={() => props.moveDownOption(cs.getOptionParameter(option, TrackingOptionParameter.Id))}>
                <IconChevronDown/>
            </ActionIcon>
            <ActionIcon variant="transparent" mr="0" size="xs" color="gray"
                        onClick={() => props.moveUpOption(cs.getOptionParameter(option, TrackingOptionParameter.Id))}>
                <IconChevronUp/>
            </ActionIcon>
        </>;
    }

    function nameOptionMenu() {
        return <Menu shadow="md"
                     position="right">
            <Menu.Target>
                <Tooltip
                    label={"Параметры подписи"}
                    offset={5}
                    arrowOffset={25} arrowSize={10}
                    openDelay={1000}
                    withArrow>
                    <ActionIcon variant="transparent" color="gray"
                                size="sm" radius="md"
                                ml={5}>
                        <IconMenu2 size={"80%"}/>
                    </ActionIcon>
                </Tooltip>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Label>Расположение</Menu.Label>
                <Radio.Group
                    onChange={(e) => cs.setOptionParameter(option, TrackingOptionParameter.LabelPosition, e)}
                    value={cs.getOptionParameter(option, TrackingOptionParameter.LabelPosition)}>
                    <Radio
                        color="gray"
                        variant="outline" size="xs" label="Слева" value="l"/>
                    <Radio
                        mt={5}
                        color="gray"
                        variant="outline" size="xs" label="Сверху" value="t"/>
                    {type !== TrackingType.Note &&
                    <Radio
                        mt={5}
                        color="gray"
                        variant="outline" size="xs" label="Справа" value="r"/>}
                    <Radio
                        mt={5}
                        color="gray"
                        variant="outline" size="xs" label="Снизу" value="d"/>
                </Radio.Group>
                <Menu.Divider/>
                <Menu.Label>Размер</Menu.Label>
                <Radio.Group
                    onChange={(e) => cs.setOptionParameter(option, TrackingOptionParameter.LabelSize, e)}
                    value={cs.getOptionParameter(option, TrackingOptionParameter.LabelSize)}>
                    <Radio
                        color="gray"
                        variant="outline" size="xs" label="Очень маленький" value="xs"/>
                    <Radio
                        mt={5}
                        color="gray"
                        variant="outline" size="xs" label="Маленький" value="sm"/>
                    <Radio
                        mt={5}
                        color="gray"
                        variant="outline" size="xs" label="Средний" value="md"/>
                    <Radio
                        mt={5}
                        color="gray"
                        variant="outline" size="xs" label="Большой" value="lg"/>
                    <Radio
                        mt={5}
                        color="gray"
                        variant="outline" size="xs" label="Очень большой" value="xl"/>
                </Radio.Group>
            </Menu.Dropdown>
        </Menu>
    }
}

export default observer(OptionDesign);