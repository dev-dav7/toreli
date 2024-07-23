import {IChatViewProps} from "./IChatViewProps";
import {ChatContentSide} from "./ChatContentSide";

export interface SwitchViewContext {
    view: (props:IChatViewProps) => JSX.Element,
    side?:ChatContentSide
}