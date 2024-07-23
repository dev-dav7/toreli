import {ChatActionType} from "./ChatActionType";
import {SwitchViewContext} from "./SwitchViewContext";
import {SendToViewContext} from "./SendToViewContext";

export interface ChatAction {
    type: ChatActionType,
    value: SwitchViewContext | SendToViewContext | (() => void),
    customIcon?: JSX.Element    //icons from tabler
    //todo Реализовать
    values?: any
}