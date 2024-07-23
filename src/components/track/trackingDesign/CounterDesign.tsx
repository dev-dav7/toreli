import {observer} from "mobx-react-lite";
import React from "react";
import {Flex, NumberInput, Text} from '@mantine/core';
import {TrackingOptionParameter} from "../../../models/trackingModels";
import {IOptionDesignProps} from "./IOptionDesignProps";
import {trackControlStore as cs} from "../../../store/trackControlStore";

function CounterDesign(props: IOptionDesignProps) {

    function get(option: TrackingOptionParameter) {
        return cs.getOptionParameter(props.optionParams, option)
    }

    function set(option: TrackingOptionParameter, value: any) {
        return cs.setOptionParameter(props.optionParams, option, value)
    }

    return <>
        <Flex gap="10">
            {digitInput("минмиум", TrackingOptionParameter.MinValue, get(TrackingOptionParameter.Step))}
            {digitInput("шаг", TrackingOptionParameter.Step, 1, 1, 25)}
            {digitInput("максимум", TrackingOptionParameter.MaxValue, get(TrackingOptionParameter.Step))}
        </Flex>
        <Flex justify="center">
            <div>
                <Text mt="5px" size="xs">по умолчанию</Text>
                <div style={{marginLeft: "5px", width: "80px"}}>
                    {digitInput("", TrackingOptionParameter.DefaultValue, get(TrackingOptionParameter.Step),
                        get(TrackingOptionParameter.MinValue), get(TrackingOptionParameter.MaxValue))}
                </div>
            </div>
        </Flex>
    </>

    function digitInput(text: string, option: TrackingOptionParameter, step?: number, min?: number, max?: number) {
        return <NumberInput
            size="xs"
            label={text}
            maxLength={6}
            allowDecimal={false}
            min={min}
            max={max}
            step={step}
            value={get(option)}
            onChange={(event) => {
                set(option, event)
                if (option === TrackingOptionParameter.MaxValue)
                    ensureMin()
                if (option === TrackingOptionParameter.MinValue)
                    ensureMax()
                ensureDefault()
            }}
        />
    }

    function ensureMin() {
        if (get(TrackingOptionParameter.MaxValue) < get(TrackingOptionParameter.MinValue))
            set(TrackingOptionParameter.MinValue, get(TrackingOptionParameter.MaxValue))
    }

    function ensureMax() {
        if (get(TrackingOptionParameter.MinValue) > get(TrackingOptionParameter.MaxValue))
            set(TrackingOptionParameter.MaxValue, get(TrackingOptionParameter.MinValue))
    }

    function ensureDefault() {
        if (get(TrackingOptionParameter.MinValue) > get(TrackingOptionParameter.DefaultValue))
            set(TrackingOptionParameter.DefaultValue, get(TrackingOptionParameter.MinValue))
        if (get(TrackingOptionParameter.MaxValue) < get(TrackingOptionParameter.DefaultValue))
            set(TrackingOptionParameter.DefaultValue, get(TrackingOptionParameter.MaxValue))
    }
}

export default observer(CounterDesign);