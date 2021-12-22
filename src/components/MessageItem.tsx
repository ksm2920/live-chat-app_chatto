import { FunctionComponent, useState } from "react";
import { Message } from "../models/Message";


type MessageProps = {
    message: Message
}
const MessageItem: FunctionComponent<MessageProps> = ({ message }) => {

    return (
        <div>
            {message.userPhoto ? (
                <img src={message.userPhoto} alt="Avatar" width={45} height={45} />
            ) : null}
            {message.userName ? <p>{message.userName}</p> : null}
            <p>{message.text}</p>
            {message.createdAt ? (
                <span>
                    {message.createdAt}
                </span>
            ) : null}
        </div>
    )
}

export default MessageItem;