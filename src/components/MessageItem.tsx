import { FunctionComponent } from "react";
import { Message } from "../models/Message";

type MessageProps = {
    message: Message
}
const MessageItem: FunctionComponent<MessageProps> = ({ message }) => {
    return (
        <div>
            <p>{message.text}</p>
        </div>
    )
}

export default MessageItem;