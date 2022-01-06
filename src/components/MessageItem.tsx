import { format } from "date-fns";
import { FunctionComponent, useEffect, useState } from "react";
import { Message } from "../models/Message";


type MessageProps = {
    message: Message
}
const MessageItem: FunctionComponent<MessageProps> = ({ message }) => {
    const [messageFrom, setMessageFrom] = useState("");
    useEffect(() => {
        if (message.userName === "Agent") {
            setMessageFrom("agent");
        } else {
            setMessageFrom("guest");
        }
    })

    return (
        <div className={`${messageFrom}`}>
            {message.userName ? <div><b>{message.userName}</b></div> : null}
            <p>{message.text}</p>
            <div>
                {format(new Date(message.createdAt), "MM/dd/yy, HH:mm:ss")}
            </div>
        </div>
    )
}

export default MessageItem;