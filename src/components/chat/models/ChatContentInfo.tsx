import {ChatContentSide} from "./ChatContentSide";
import {IChatViewProps} from "./IChatViewProps";

export interface ChatContentInfo {
    viewKey: string,
    view: (props:IChatViewProps) => JSX.Element,
    side: ChatContentSide
}