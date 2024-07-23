import React from "react";
import {observer} from "mobx-react-lite";
import {ChatContentSide} from "./models/ChatContentSide";
import {SendToViewContext} from "./models/SendToViewContext";
import {IChatActionProps} from "./models/IChatActionProps";
import {ChatConst} from "./chatConstants";

export interface IChatContentProps {
    view: (viewKey: string,
           actions: SendToViewContext[],
           updateActionCallback: (key: string, actions: IChatActionProps[]) => void,
           scrollToBottomCallback?: () => void,
           data?: any) => JSX.Element
    side: ChatContentSide,
    chatWidth:number
}

function ChatContent({side, view, chatWidth}: IChatContentProps) {

    return <div style={{
        marginTop: "10px",
        display: "flex",
    }}>
        <div style={{
            borderRadius: "10px",
            backgroundColor: "whitesmoke",
            padding: "5px 10px 5px 10px",
            display: "inline-block",
            marginRight: side === ChatContentSide.Right ? "0" : "auto",
            marginLeft: side === ChatContentSide.Left ? "0" : "auto",
            maxWidth: (chatWidth ?? ChatConst.baseChatMessageSize) - 25
        }}>
            {// @ts-ignore
                view()
            }
        </div>
    </div>

}

export default observer(ChatContent)
