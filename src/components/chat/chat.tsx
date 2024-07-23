import {CloseButton, Group, ScrollArea, TextInput} from "@mantine/core";
import React, {useEffect, useRef, useState} from "react";
import {observer} from "mobx-react-lite";
import {useElementSize, useFocusTrap} from "@mantine/hooks";
import ChatContent from "./chatContent";
import {IChatActionProps} from "./models/IChatActionProps";
import ChatAction from "./chatAction";
import {ChatContentInfo} from "./models/ChatContentInfo";
import {ChatActionType} from "./models/ChatActionType";
import {ChatActionCallback} from "./models/ChatActionCallback";
import {ChatActionCallbackType} from "./models/ChatActionCallbackType";
import {SendToViewContext} from "./models/SendToViewContext";
import {ChatContentSide} from "./models/ChatContentSide";
import {TrackViewModel} from "../../models/trackingModels";
import {GroupModel} from "../../models/models";
import {trackControlStore as cs} from "../../store/trackControlStore";
import ChatTrackView from "./views/chatTrackView";
import {SwitchViewContext} from "./models/SwitchViewContext";
import {runInAction} from "mobx";
import ChatHelpView from "./views/chatHelpView";
import UserSettingView from "./views/userSettingView";

interface IChatProps {
    width: number
    height: number,
    bottomSpace: number,
    initView: SwitchViewContext,
    //Дальше данные относящие к проекту
    data: any,
    //todo можно набором тип+запрос для большей гибкости/чистоты
    trackSelector: () => TrackViewModel[],
    groupSelector: () => GroupModel[],
}

function Chat({width, height, bottomSpace, initView, trackSelector, groupSelector, data}: IChatProps) {

    const defaultActions: IChatActionProps[] = [
        {
            color: "#719bd5",
            text: "В начало",
            actionCallback: actionCallback,
            actions: [{
                type: ChatActionType.ChangeView,
                value: initView
            }]
        },
        {
            color: "#719bd5",
            text: "Помощь",
            actionCallback: actionCallback,
            actions: [{
                type: ChatActionType.ChangeView,
                value: {
                    view: (props) => <ChatHelpView  {...props}/>,
                    side: ChatContentSide.Left
                }
            }]
        },
        {
            color: "#719bd5",
            text: "Пользователь",
            actionCallback: actionCallback,
            actions: [{
                type: ChatActionType.ChangeView,
                value: {
                    view: (props) => <UserSettingView  {...props}/>,
                }
            }]
        },
        {
            color: "#719bd5",
            text: "Очистить",
            actionCallback: actionCallback,
            actions: [{
                type: ChatActionType.ChatAction,
                value: () => {
                    currentContentKey.current = ""
                    runInAction(() => {
                        setUserAction(undefined)
                        setContextActions([])
                        setChatContents([])
                    })
                }
            }]
        },
        {
            color: "#a142f5",
            text: "В обычный вид",
            actionCallback: actionCallback,
            actions: [{
                type: ChatActionType.ChatAction,
                value: () => window.location.pathname = "main"
            }]
        },
    ]

    const {ref: chatActionsRef, height: chatActionHeight} = useElementSize()
    const textInputTrapRef = useFocusTrap()
    const chatViewRef = useRef<HTMLDivElement>(null);
    const [chatBottom, setChatBottom] = useState<string>("0")
    const [chatHeight, setChatHeight] = useState<number>(height)

    const [inputText, setInputText] = useState<string>("")
    const [userAction, setUserAction] = useState<SendToViewContext>()

    const currentContentKey = useRef<string>("")
    const [chatContents, setChatContents] = useState<ChatContentInfo[]>([])

    const [contextActions, setContextActions] = useState<IChatActionProps[]>([])
    const [trackActions, setTrackActions] = useState<IChatActionProps[]>([])
    const [serviceActions, setServiceActions] = useState<IChatActionProps[]>([])

    useEffect(() => {
        setServiceActions(defaultActions)
        switchView(initView)
    }, [])

    useEffect(() => {
        setTrackActions(trackSelector().map(x => {
            return {
                color: cs.getTrackColor(x),
                text: cs.findTrackName(x),
                actionCallback: actionCallback,
                actions: [{
                    type: ChatActionType.ChangeView,
                    value: {
                        view: (props) => <ChatTrackView {...props} data={{
                            track: x,
                            yearCount: data.yearCount,
                            startYear: data.startYear,
                            trackSelector: trackSelector,
                            groupSelector: groupSelector,
                            isTracksOpen: false
                        }}/>
                    }
                }]
            }
        }))
    }, [trackSelector])

    useEffect(() => {
        scrollToBottom()
    }, [width, height, chatActionHeight, chatContents, userAction])

    useEffect(() => {
        setChatHeight(height - chatActionHeight - 30 - bottomSpace)
        setChatBottom(`${bottomSpace}px`)
    }, [height, chatActionHeight, bottomSpace])

    function actionCallback(action: ChatActionCallback) {
        if (action.type === ChatActionCallbackType.ChangeView)
            switchView(action.value)
        if (action.type === ChatActionCallbackType.SendToView)
            sendToView(action.value)
        if (action.type === ChatActionCallbackType.ChatAction)
            action.value()
    }

    function switchView(switchContext: SwitchViewContext) {
        setChatContents((prev) => {
            const nextKey = `${prev.length + 1}`
            currentContentKey.current = nextKey
            return [...prev, {
                view: switchContext.view,
                viewKey: nextKey,
                side: switchContext.side ?? ChatContentSide.Right
            }]
        })
        setUserAction(undefined)
        setContextActions([])
    }

    function sendToView(action: SendToViewContext) {
        if (currentContentKey.current !== "")
            setUserAction(() => action)
    }

    const scrollToBottom = () => {
        chatViewRef.current!.scrollTo({
            top: chatViewRef.current!.scrollHeight,
            behavior: 'smooth',
        })
    }

    function updateActionsFromView(contentKey: string, newActions: IChatActionProps[]) {
        if (currentContentKey.current === "")
            return

        if (currentContentKey.current !== contentKey)
            return

        setContextActions(newActions.map(x => {
                return {
                    text: x.text,
                    color: x.color,
                    actions: x.actions,
                    actionCallback: actionCallback,
                    disabled: x.disabled
                }
            }
        ))
    }

    function getContextActions() {
        if (inputText === "")
            return [...contextActions, ...serviceActions]

        return [
            ...contextActions.filter(x => x.text.toLowerCase().includes(inputText.toLowerCase())),
            ...trackActions.filter(x => inputText.toLowerCase() === "треки" || x.text.toLowerCase().includes(inputText.toLowerCase())),
            ...serviceActions]
    }

    function getUserAction(key: string) {
        if (key !== currentContentKey.current)
            return undefined

        if (!userAction)
            return undefined

        //todo начинает рендерить компонент во время рендера другого компонента
        const result = userAction
        setUserAction(undefined)
        return result
    }

    return <div className={"chatContainer"}
                style={{
                    height: "inherit",
                    width: `${width}px`
                }}>
        <div className={"chat"}
             style={{
                 width: "inherit",
                 position: "absolute",
                 bottom: chatBottom,
                 padding: "5px",
                 borderRadius: "10px",
                 marginTop: "15px"
             }}>
            <ScrollArea.Autosize
                className={"chatView"}
                mah={chatHeight}
                mx="auto"
                scrollbars="y"
                viewportRef={chatViewRef}>
                <div className={"chatContent"}
                     style={{marginRight: "15px"}}>
                    <div style={{height: chatHeight}}/>
                    {chatContents
                        .map(chatContent => {
                            const scrollCallback = chatContent.viewKey === currentContentKey.current
                                ? scrollToBottom
                                : () => {
                                }
                            return <ChatContent
                                view={() => chatContent.view({
                                    userAction: getUserAction(chatContent.viewKey),
                                    viewKey: chatContent.viewKey,
                                    updateActionCallback: updateActionsFromView,
                                    scrollToBottomCallback: scrollCallback,
                                    chatHeight: chatHeight,
                                    chatWidth: width
                                })}
                                side={chatContent.side}
                                key={chatContent.viewKey}
                                chatWidth={width}
                            />
                        })}
                </div>
            </ScrollArea.Autosize>
            <div className={"chatActions"}
                 ref={chatActionsRef}
                 style={{
                     marginTop: "10px",
                     backgroundColor: "#fafafae0",
                     borderRadius: "10px"
                 }}>
                <ScrollArea.Autosize
                    mih={85}
                    mah={85}
                    mx="auto"
                    scrollbars="y">
                    <Group
                        className={"contextActions"}
                        gap={5}
                        style={{
                            padding: "5px",
                        }}>
                        {getContextActions()
                            .map((chatAction, i) => <ChatAction key={i} {...chatAction}/>)}
                    </Group>
                </ScrollArea.Autosize>
                <TextInput variant="filled"
                           mt={5}
                           size="xs"
                           radius="md"
                           placeholder="Начните ввод"
                           value={inputText}
                           onChange={(event) => setInputText(event.target.value)}
                           ref={textInputTrapRef}
                           rightSection={
                               <CloseButton
                                   size="sm"
                                   onClick={() => setInputText("")}
                                   style={{display: inputText ? undefined : 'none', borderRadius: "5px"}}
                               />}/>
            </div>
        </div>
    </div>
}

export default observer(Chat)
