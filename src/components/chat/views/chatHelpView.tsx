import React, {useEffect} from "react";
import {observer} from "mobx-react-lite";
import {IChatViewProps} from "../models/IChatViewProps";
import {useElementSize} from "@mantine/hooks";
import {Button, Space, Text,} from '@mantine/core';
import {IconArrowBigUp, IconCircleArrowRight, IconCirclePlus, IconProgressBolt} from "@tabler/icons-react";
import {ChatConst} from "../chatConstants";

function ChatHelpView({scrollToBottomCallback}: IChatViewProps) {
    const {ref: viewRef, height: viewHeight} = useElementSize()

    //Промотка чата вниз
    useEffect(() => {
        scrollToBottomCallback!()
    }, [viewHeight])

    return <div
        ref={viewRef}
        style={{width: ChatConst.baseChatMessageSize}}>
        <Text size="sm" ta={"center"}>Коротко о главном</Text>
        <Space h="xs"/>
        <Text size="sm">Под чатом есть контекстное меню с кнопками. С помощью этих кнопок ты можешь открывать части
            приложения, управлять ими, или выполнять какие-либо действия.</Text>
        <Space h="xs"/>
        <Text size="sm">У кнопки может быть несколько иконок. Каждая иконка - свое действие.</Text>
        <Space h="xs"/>
        <Text size="sm">По иконкам можно понять какое действие будет выполнено:</Text>
        <Space h="xs"/>
        <div style={{display: "flex", gap: "10px"}}>
            {renderButton(<IconArrowBigUp size={16}/>)}
            <Text size="sm">Стрелка вверх - заменит часть приложения в чате на новую</Text>
        </div>

        <Space h="xs"/>
        <div style={{display: "flex", gap: "10px"}}>
            {renderButton(<IconCircleArrowRight size={18}/>)}
            <Text size="sm">Стрелка вправо в круге - добавит новые кнопки в контекстное меню</Text>
        </div>

        <Space h="xs"/>
        <div style={{display: "flex", gap: "10px"}}>
            {renderButton(<IconCirclePlus size={18}/>)}
            <Text size="sm">Плюс в круге - добавит информацию в последнее отображение в чате</Text>
        </div>

        <Space h="xs"/>
        <div style={{display: "flex", gap: "10px", borderColor:"red"}}>
            {renderButton(<IconProgressBolt size={18}/>)}
            <Text size="sm">Молния в круге - выполнит некое действие 🤪</Text>
        </div>
        <Space h="xs"/>
        <Text size="sm">Успехов!</Text>

    </div>

    function renderButton(icon: JSX.Element) {
        return <Button variant="light" color={"blue"} size="compact-sm" radius="md"
                       styles={{
                           section: {marginInlineStart: "0px"},
                           root: {paddingRight: "6px"}
                       }}
                       rightSection={icon}>
        </Button>
    }
}

export default observer(ChatHelpView)
