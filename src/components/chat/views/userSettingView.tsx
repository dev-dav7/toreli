import React, {useContext, useEffect} from "react";
import {observer} from "mobx-react-lite";
import {IChatViewProps} from "../models/IChatViewProps";
import {useElementSize} from "@mantine/hooks";
import {Button, Text,} from '@mantine/core';
import {AuthContext} from "../../../main";

function UserSettingView({
                             scrollToBottomCallback,
                         }: IChatViewProps) {
    const {userStore} = useContext(AuthContext);
    const {ref: viewRef, height: viewHeight} = useElementSize()

    //Промотка чата вниз
    useEffect(() => {
        scrollToBottomCallback!()
    }, [viewHeight])

    //Промотка чата вниз
    useEffect(() => {

    }, [])

    return <div ref={viewRef} style={{paddingBottom: '5px'}}>
        <Text size="sm" ta={"center"}>пользователь</Text>
        <Text size={"sm"} ta={"center"}>{userStore.name}</Text>
        <Text size={"sm"} ta={"center"}>год рождения: {userStore.birthdayYear}</Text>
        <div style={{display: "flex", justifyContent: 'center'}}>
            <Button variant="filled"
                    color="gray"
                    size="compact-sm"
                    mt="xs"
                    w="250px"
                    fullWidth
                    onClick={() => userStore.logout()}>
                Выйти
            </Button>
        </div>
    </div>
}

export default observer(UserSettingView)
