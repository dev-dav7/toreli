import React, {useEffect, useState} from "react";
import {observer} from "mobx-react-lite";
import {IChatViewProps} from "../../models/IChatViewProps";
import {IChatActionProps} from "../../models/IChatActionProps";
import {useElementSize} from "@mantine/hooks";
import {Text,} from '@mantine/core';
import {ChatConst} from "../../chatConstants";

function ExampleChatView({userAction, scrollToBottomCallback, updateActionCallback, viewKey, data}: IChatViewProps) {
    const {ref: viewRef, height: viewHeight} = useElementSize()

    const [exampleText, setExampleText] = useState<string>("")

    //Обработка действий от пользователя пришедших через контекстное меню
    useEffect(() => {
    }, [userAction])

    //Промотка чата вниз
    useEffect(() => {
        scrollToBottomCallback!()
    }, [viewHeight])

    useEffect(() => {
        //Данные для отображения элемента
        setExampleText(data as string)

        //Установка контекстных действий при открытии
        updateContextActions([])
    }, [])

    return <div
        ref={viewRef}
        style={{width: `${ChatConst.baseChatMessageSize}`}}>
        <Text size="sm">Привествую!</Text>
        <Text size="sm">Передано: {exampleText}</Text>
    </div>

    //Обновление контекстных действий при открытии
    function updateContextActions(actions: IChatActionProps[]) {
        updateActionCallback(viewKey, actions)
    }

}

export default observer(ExampleChatView)
