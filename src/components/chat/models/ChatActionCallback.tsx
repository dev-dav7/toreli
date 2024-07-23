import {ChatActionCallbackType} from "./ChatActionCallbackType";

export interface ChatActionCallback {
    type: ChatActionCallbackType,
    value: any,
}

