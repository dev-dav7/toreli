import {observer} from "mobx-react-lite";
import React from "react";
import {TrackingOptionParameter, TrackingType,} from "../../../models/trackingModels";
import CheckView from "./CheckView";
import NoteView from "./NoteView";
import CounterView from "./CounterView";
import DayTimeView from "./DayTimeView";
import {Container, Flex, Text} from "@mantine/core";
import {IOptionViewProps} from "./IOptionViewProps";
import {trackControlStore as cs} from "../../../store/trackControlStore";

function OptionView(props: IOptionViewProps) {
    const DesignByType: { [key in TrackingType]: JSX.Element } = {
        Note: <NoteView {...props}/>,
        Check: <CheckView {...props}/>,
        Counter: <CounterView {...props}/>,
        DayTime: <DayTimeView {...props} />,
    };

    const name = cs.getOptionParameter(props.model, TrackingOptionParameter.Name)
    const labelStyle = cs.getLabelStyle(props.model);
    const type = cs.getOptionParameter(props.model, TrackingOptionParameter.Type) as TrackingType

    return <Container p={0}>
        <Flex align="center"
              justify={labelStyle.justify}
              direction={labelStyle.direction as any}
              wrap="wrap">
            {name &&
            <Text size={labelStyle.labelSize}
                  ml={labelStyle.direction === 'row-reverse' ? 5 : 0}
                  mr={labelStyle.direction === 'row' ? 5 : 0}>
                {name}
            </Text>}
            {DesignByType[type]}
        </Flex>
    </Container>
}

export default observer(OptionView);