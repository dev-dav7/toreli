import {Carousel} from "@mantine/carousel";
import {ChatConst} from "./chatConstants";
import React from "react";
import {observer} from "mobx-react-lite";
import {control} from './chatCarousel.module.css';

export interface IChatCarouselProps {
    slides: React.ReactNode[]
}

function ChatCarousel({slides}: IChatCarouselProps) {
    return <Carousel
        slideSize={ChatConst.baseChatMessageSize}
        height="100%"
        slideGap="0"
        includeGapInSize={true}
        loop={true}
        initialSlide={slides.length}
        withControls={false}
        containScroll="trimSnaps"
        classNames={control}
        styles={{
            slide: {flex:"none"},
        }}
    >
        {slides.map((c) => slide(c))}
    </Carousel>

    function slide(content: React.ReactNode) {
        return <Carousel.Slide p={0} pb={5}>
            {content}
        </Carousel.Slide>
    }
}

export default observer(ChatCarousel)
