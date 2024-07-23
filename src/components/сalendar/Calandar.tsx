import {ScrollArea, Text} from "@mantine/core";
import DateLine from "./DateLine";
import React, {useEffect, useMemo, useState} from "react";
import {dateStore} from "../../store/dateStore";
import {TrackViewModel, ValuesModel} from "../../models/trackingModels";
import {observer} from "mobx-react-lite";

interface ICalendarProps {
    tracksForShow: TrackViewModel[],
    valuesForRender: ValuesModel[],
    startYear: number,
    selectedDay: number,
    setSelectedDay: (day: number) => void,
    valueIterator: number
}

function Calendar({
                      tracksForShow,
                      startYear,
                      selectedDay,
                      setSelectedDay,
                      valuesForRender,
                      valueIterator
                  }: ICalendarProps) {
    const [years, setYears] = useState<JSX.Element[]>(() => [])

    const yearForRender = useMemo(() => [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
        10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
        30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
        40, 41, 42, 43, 44, 45, 46, 47, 48, 49,
        50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
        60, 61, 62, 63, 64, 65, 66, 67, 68, 69,
        70, 71, 72, 73, 74, 75, 76, 77, 78, 79,
        80, 81, 82, 83, 84, 85, 86, 87, 88, 89,
        90, 91, 92, 93, 94, 95, 96, 97, 98, 99,
        100
    ], [])


    useEffect(() => {
        setYears(buildYears())
    }, [tracksForShow, selectedDay, startYear,valueIterator])

    function buildYears() {
        const currentYear = new Date().getFullYear()
        const todayDay = dateStore.getDay(new Date(), startYear)

        return (yearForRender.map((x) =>
            <DateLine
                key={x}
                year={x + startYear}
                startYear={startYear}
                todayDay={todayDay}
                isCurrentYear={x + startYear === currentYear}
                selectedDay={selectedDay}
                tracksForShow={tracksForShow}
                setCurrentDay={(newDay: number) => setSelectedDay(newDay)}
                values={valuesForRender}
                valueIterator={valueIterator}
            />))
    }

    return <div style={{height: "100%", margin: "5px", display: "flex", flexDirection: "column"}}>
        <Text ml="auto" mr="20">
            {startYear} — {startYear + yearForRender[yearForRender.length - 1]}
        </Text>
        <ScrollArea offsetScrollbars type="always" scrollbars="y"
                    style={{
                        paddingRight: "5px",
                        flex: "auto"
                    }}>
            {years}
        </ScrollArea>
    </div>
}

export default observer(Calendar);