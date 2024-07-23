import {ChatAction} from "./ChatAction";
import {ChatActionCallback} from "./ChatActionCallback";

export interface IChatActionProps {
    text: string,
    color: string,
    actions: ChatAction[],
    actionCallback?: (action: ChatActionCallback) => void,
    disabled?:boolean
}