import { format, formatRelative, subDays } from "date-fns";
import { FunctionComponent, useEffect, useState } from "react";
import { Message } from "../models/Message";


type MessageProps = {
    message: Message
}
const MessageItem: FunctionComponent<MessageProps> = ({ message }) => {
    const [messageFrom, setMessageFrom] = useState("");
    useEffect(() => {
        if(message.userName === "Agent") {
            setMessageFrom("agent");
        } else {
            setMessageFrom("guest");
        }
    })

    return (
        <div className={`${messageFrom}`}>
            {message.userPhoto ? (
                <img src={message.userPhoto} alt="Avatar" width={45} height={45} />
            ) : null}
            {/* {message.userName ? <div>{message.userName}</div> : null} */}
            <p>{message.text}</p>
            {message.createdAt ? (
                <div>
                    {format(new Date(message.createdAt), "MM/dd/yyyy 'at' HH:mm")}
                </div>
            ) : null}
        </div>
    )
}

export default MessageItem;