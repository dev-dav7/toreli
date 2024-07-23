import {SendToViewContext} from "./SendToViewContext";
import {IChatActionProps} from "./IChatActionProps";

export interface IChatViewProps {
    userAction?: SendToViewContext
    viewKey: string,
    scrollToBottomCallback?: () => void,
    updateActionCallback: (key: string, actions: IChatActionProps[]) => void,
    chatHeight?: number,
    chatWidth?: number,
    //todo Подумать как сделать лучше
    data?: any,
    //todo Реализовать
    contextActionSelectors?: any
}