import React, {useContext, useEffect} from 'react';
import {observer} from "mobx-react-lite";
import {mainStore} from "../store/mainStore";
import {Button, Container, Loader, ScrollArea, Tabs, Text} from '@mantine/core';
import TrackFill from "../components/track/TrackFill";
import Calendar from "../components/сalendar/Calandar";
import {AuthContext} from "../main";
import GroupBuilder from "../components/track/GroupBuilder";
import {trackStorageStore as ts} from "../store/trackStorageStore";
import {useViewportSize} from "@mantine/hooks";
import TrackDesignView from "../components/track/trackingDesign/TrackDesignView";
import TrackValuesEditorView from "../components/track/trackValuesEditor/trackValuesEditorView";
import {ChatConst} from "../components/chat/chatConstants";

function MainPage() {
    const {userStore} = useContext(AuthContext);
    const {height} = useViewportSize()

    useEffect(() => {
        mainStore.init()
    }, [])

    useEffect(() => {
        ts.init()
    }, [])

    return <>
        {(!mainStore.isInit || !ts.isInit) &&
        <div style={{height: height}}>
            <Loader color="rgba(61, 173, 102, 1)" size="lg" style={{
                marginLeft: "50%",
                top: "30%",
                position: "fixed"
            }}/>
        </div>}
        {mainStore.isInit && ts.isInit &&
        <div style={{display: "flex", height: height}}>
            <div style={{width: "850px", height: "98%"}}>
                <Calendar
                    startYear={mainStore.startYear}
                    tracksForShow={mainStore.tracksForShow}
                    selectedDay={-1}//mainStore.selectedDay}
                    setSelectedDay={(day: number) => mainStore.setSelectedDay(day)}
                    valuesForRender={ts.values}
                    valueIterator={ts.valueIterator}/>
            </div>
            <Tabs defaultValue="fill" style={{width: ChatConst.maxChatMessageSize, height: "98%"}} ml="xs"
                  styles={{tab: {padding: "8px"}}}>
                <Tabs.List grow>
                    <Tabs.Tab value="fill"> сегодня </Tabs.Tab>
                    <Tabs.Tab value="trackValuesEditor"> редактор </Tabs.Tab>
                    <Tabs.Tab value="trackCreate"> создать трек </Tabs.Tab>
                    <Tabs.Tab value="groupCreate"> группы </Tabs.Tab>
                    <Tabs.Tab value="usrSettings"> пользователь </Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="trackCreate" style={{height: "98%", overflowX: "hidden"}}>
                    <ScrollArea.Autosize mah={"90%"}
                                         mx="auto"
                                         scrollbars="y"
                                         style={{overflowX: "hidden"}}>
                        <TrackDesignView/>
                    </ScrollArea.Autosize>
                </Tabs.Panel>
                <Tabs.Panel value="fill" style={{height: "98%"}}>
                    <TrackFill/>
                </Tabs.Panel>
                <Tabs.Panel value="trackValuesEditor" style={{height: "98%"}}>
                    <TrackValuesEditorView
                        updateValuesCallback={(trackId, newValues) => ts.updateValues(trackId, newValues)}
                        tracks={ts.tracks}
                        groups={ts.groups}
                        startYear={mainStore.startYear}
                        maxDate={new Date(mainStore.startYear + mainStore.yearCount, 0, 1)}
                        minDate={new Date(mainStore.startYear, 0, 1)}
                        preSelectedTrack={undefined}
                    />
                </Tabs.Panel>
                <Tabs.Panel value="groupCreate">
                    <GroupBuilder/>
                </Tabs.Panel>
                <Tabs.Panel value="usrSettings">
                    <Container w="300px" className="homePage" mt="md">
                        <Text>Выполнен входя для: {userStore.name}</Text>
                        <Text mt="xs">Год рождения: {userStore.birthdayYear}</Text>
                        <Button variant="filled"
                                color="gray"
                                size="md"
                                mt="xs"
                                w="250px"
                                fullWidth
                                onClick={() => userStore.logout()}>
                            Выйти
                        </Button>
                    </Container>
                </Tabs.Panel>
            </Tabs>
        </div>}
    </>
}

export default observer(MainPage)

