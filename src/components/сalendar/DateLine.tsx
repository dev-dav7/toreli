import React, {useEffect, useMemo, useState} from 'react';
import DateBlock from "./DateBlock";
import {Text} from '@mantine/core';
import {dateStore} from "../../store/dateStore";
import {trackControlStore as cs} from "../../store/trackControlStore";
import {TrackViewModel, ValuesModel} from "../../models/trackingModels";
import {observer} from "mobx-react-lite";

interface IDateLineProps {
    text?: string
    year: number,
    startYear: number,
    todayDay: number,
    selectedDay: number,
    isCurrentYear: boolean,
    setCurrentDay: (newDay: number) => void,
    tracksForShow: TrackViewModel[],
    values: ValuesModel[],
    valueIterator: number
}

function DateLine(props: IDateLineProps) {
    const [isHover, setIsHover] = useState(false)
    const [elems, setElems] = useState<JSX.Element[]>([])
    const baseColor = "#f3f3f3"

    //52 недели года
    const blockIndexes: number[] = useMemo(() => [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
        11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
        31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
        41, 42, 43, 44, 45, 46, 47, 48, 49, 50,
        51, 52], [])

    //шаг итератора, в неделе = 7 дней, по индексам 0..6/7..13/... = 7 элементов
    const blockIteratorStep = 6

    useEffect(() => {
        setElems(buildElem())
    }, [props.year, props.selectedDay, props.tracksForShow, props.valueIterator])

    return <div onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
                style={{display: "flex", maxHeight: "15px", background: (isHover ? "#c5c6c7" : "")}}>
        <Text style={{
            width: "30px",
            textAlign: "center",
            display: "block",
            fontSize: "11px",
            paddingLeft: "5px",
            color: props.isCurrentYear ? "#1659f5" : "black",
            verticalAlign: "top"
        }}>
            {isHover ? props.year - props.startYear : props.year}
        </Text>
        <div style={{paddingLeft: "10px", display: "flex"}}>
            {elems}
        </div>
    </div>

    function buildElem() {
        const yearStartDay = dateStore.getDay(new Date(props.year, 0, 1), props.startYear)
        const yearFinishDay = dateStore.getDay(new Date(props.year, 11, 31), props.startYear)

        const trackIndexes = props.tracksForShow.map(x => x.id)
        const cache = props.values.filter(x =>
            trackIndexes.includes(x.trackId) &&
            x.values.some(x => x.values.length > 0) &&
            ((x.day <= yearFinishDay && x.dayE >= yearFinishDay) ||
                (x.day <= yearStartDay && x.dayE >= yearStartDay) ||
                (x.day >= yearStartDay && x.dayE <= yearFinishDay)))
        let dayIterator = yearStartDay
        return blockIndexes.map((x) => {
            const weekFrom = dayIterator
            let weekTo = dayIterator + blockIteratorStep
            if (x === blockIndexes.length)
                weekTo = yearFinishDay

            const filledTrackIds = cache
                .filter(x => (
                    (x.day <= weekTo && x.dayE >= weekTo) ||
                    (x.day <= dayIterator && x.dayE >= dayIterator) ||
                    (x.day >= dayIterator && x.dayE <= weekTo)))
                .map(x => x.trackId)

            const isCurrentWeek = props.todayDay >= dayIterator && props.todayDay <= weekTo
            const isSelectedWeek = props.selectedDay >= dayIterator && props.selectedDay <= weekTo
            const border = isSelectedWeek ? "2px dashed blue" : isCurrentWeek ? "2px dashed gray" : "1px solid #ffffffff"

            dayIterator = weekTo + 1

            let trackColor = baseColor
            for (let i = 0; i <= props.tracksForShow.length; i++) {
                if (filledTrackIds.findIndex(ft => ft === props.tracksForShow[i].id) >= 0) {
                    trackColor = cs.getTrackColor(props.tracksForShow[i])
                    i = props.tracksForShow.length
                }
            }

            return <DateBlock
                key={weekTo}
                color={trackColor}
                border={border}
                onClick={() => props.setCurrentDay(weekFrom)}/>
        })
    }
}

export default observer(DateLine)