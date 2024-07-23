import React from "react";
import {observer} from "mobx-react-lite";
import {Button, ButtonGroup} from "@mantine/core";
import {IChatActionProps} from "./models/IChatActionProps";
import {IconArrowBigUp, IconCaretUpDown, IconCirclePlus, IconProgressBolt} from "@tabler/icons-react";
import {ChatActionType} from "./models/ChatActionType";
import {ChatActionCallbackType} from "./models/ChatActionCallbackType";

function ChatAction({actions, color, text, actionCallback, disabled}: IChatActionProps) {

    return <ButtonGroup>
        {actions.map((x, i) =>
            <Button variant="light" color={color} size="compact-sm" radius="md"
                    key={i}
                    disabled={disabled}
                    autoContrast
                    styles={{
                        section: {marginInlineStart: i === 0 ? "6px" : "0px"},
                        root: {paddingRight: i !== 0 ? "6px" : "3px"}
                    }}
                    style={{
                        border: `1px solid color-mix(in srgb, ${color} 30%, white)`,
                        borderLeft: `1px solid color-mix(in srgb, ${color} ${i !== 0 ? "30" : "40"}%, white)`
                    }}
                //todo for select and <**> value from selector
                    onClick={() =>
                        actionCallback!({
                            type: getCallbackType(x.type),
                            value: x.value
                        })}
                    rightSection={getIcon(x.type, x.customIcon)}>
                {i === 0 ? getText() : ""}
            </Button>)
        }
    </ButtonGroup>

    function getText() {
        if (text.length > 18)
            return text.slice(0, 16) + "..."
        return text
    }

    function getIcon(type: string, customIcon?: JSX.Element) {
        if (customIcon)
            return customIcon

        if (type === ChatActionType.ChangeView)
            return <IconArrowBigUp size={14}/>
        if (type === ChatActionType.SendToView)
            return <IconCirclePlus size={18}/>
        if (type === ChatActionType.SelectAndSendToView)
            return <IconCaretUpDown size={16}/>
        if (type === ChatActionType.ChatAction)
            return <IconProgressBolt size={18}/>
    }

    function getCallbackType(type: ChatActionType): ChatActionCallbackType {
        if (type === ChatActionType.ChangeView ||
            type === ChatActionType.SelectAndChangeView)
            return ChatActionCallbackType.ChangeView

        if (type === ChatActionType.SendToView ||
            type === ChatActionType.SelectAndSendToView)
            return ChatActionCallbackType.SendToView

        if (type === ChatActionType.ChatAction)
            return ChatActionCallbackType.ChatAction

        throw "Неизвестный тип действия"
    }
}


export default observer(ChatAction)
