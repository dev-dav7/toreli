import React, {useEffect} from "react";
import {observer} from "mobx-react-lite";
import {IChatViewProps} from "../models/IChatViewProps";
import {useElementSize} from "@mantine/hooks";
import {Text,} from '@mantine/core';
import TrackDesignView from "../../track/trackingDesign/TrackDesignView";

function TrackConstructorView({
                                  scrollToBottomCallback,
                              }: IChatViewProps) {
    const {ref: viewRef, height: viewHeight} = useElementSize()


    //Промотка чата вниз
    useEffect(() => {
        scrollToBottomCallback!()
    }, [viewHeight])

    return <div ref={viewRef}>
        <Text size="sm" ta={"center"}>конструктор трека</Text>
        <TrackDesignView/>
    </div>
}

export default observer(TrackConstructorView)
