import React, {useContext, useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import {useViewportSize} from "@mantine/hooks";
import Chat from "../components/chat/chat";
import {Loader} from "@mantine/core";
import {trackStorageStore as ts} from "../store/trackStorageStore";
import ToreliChatMainView from '../components/chat/views/toreliChatMainView';
import {ChatContentSide} from "../components/chat/models/ChatContentSide";
import {AuthContext} from "../main";
import {ChatConst} from "../components/chat/chatConstants";

function ChatPage() {
    const {userStore} = useContext(AuthContext);

    const {height: viewportHeight, width: viewportWidth} = useViewportSize()
    const [chatWidth, setChatWidth] = useState<number>(ChatConst.baseChatMessageSize)
    const [chatHeight, setChatHeight] = useState<number>(1000)
    const [chatBottom, setChatBottom] = useState<number>(0)

    useEffect(() => {
        ts.init()
    }, [])

    useEffect(() => {
        if (viewportWidth < ChatConst.baseChatMessageSize) {
            setChatWidth(ChatConst.baseChatMessageSize)
        } else if (viewportWidth < ChatConst.standardChatSize) {
            setChatWidth(viewportWidth)
        } else {
            setChatWidth(ChatConst.standardChatSize)
        }
    }, [viewportWidth])

    useEffect(() => {
        setChatHeight(viewportHeight)
    }, [viewportHeight])

    useEffect(() => {
        if (viewportWidth > 1440) {
            setChatBottom(viewportHeight / 100 * 16)
        } else if (viewportWidth > 1000) {
            setChatBottom(viewportHeight / 100 * 8)
        }
    }, [viewportHeight, viewportWidth])

    return <div
        className={"chatPageLayout"}
        style={{
            height: `${100}%`,
            width: `${100}%`,
            minWidth: "320px",
            overflowY: "hidden",
            overflowX: "auto",
            boxSizing:"border-box"
        }}>
        {!ts.isInit &&
        <div style={{height: "100%"}}>
            <Loader color="rgba(61, 173, 102, 1)" size="lg" style={{
                marginLeft: "50%",
                top: "30%",
                position: "fixed"
            }}/>
        </div>}
        {ts.isInit &&
        <div style={{display: "flex"}}>
            <div style={{
                marginRight: "auto",
                marginLeft: "auto",
            }}>
                <Chat width={chatWidth}
                      height={chatHeight}
                      bottomSpace={chatBottom}
                      trackSelector={() => ts.tracks}
                      groupSelector={() => ts.groups}
                      initView={{
                          view: (props) =>
                              <ToreliChatMainView
                                  {...props}
                                  data={{
                                      trackSelector: () => ts.tracks,
                                      groupSelector: () => ts.groups,
                                      yearCount: 100,
                                      startYear: userStore.birthdayYear,
                                      userName: userStore.name,
                                      width: chatWidth,
                                      height: chatHeight,
                                  }}/>,
                          side: ChatContentSide.Left
                      }}
                      data={{
                          yearCount: 100,
                          startYear: userStore.birthdayYear,
                      }}
                />
            </div>
        </div>}
    </div>
}

export default observer(ChatPage)

