import { format } from "date-fns";
import { FunctionComponent, useEffect, useState } from "react";
import { Message } from "../models/Message";
import { AiOutlineCheckCircle } from "react-icons/ai";


type MessageProps = {
    message: Message
}
const MessageItem: FunctionComponent<MessageProps> = ({ message }) => {
    const [messageFrom, setMessageFrom] = useState("");
    const [showStatusIcon, setStatusIcon] = useState(showStatus(window.location.pathname));
    useEffect(() => {
        if (message.userName === "Agent") {
            setMessageFrom("agent");
        } else {
            setMessageFrom("guest");
        }
    })

    return (
        <div className={`${messageFrom}`}>
            {message.userName? <div className="user-name"><b>{message.userName}</b></div> : null}
            <p> {message.text}</p>
            <div className="sending-time">
                {format(new Date(message.createdAt), "HH:mm:ss")}
                {showStatusIcon? !message.isRead && <span className="unread"><AiOutlineCheckCircle/></span>: ""} 
                {showStatusIcon? message.isRead && messageFrom === "guest"? <span className="read"><AiOutlineCheckCircle/></span>: "" : " "}
            </div>
        </div>
    )
    function showStatus(pathname: string) {
        return ["/"].includes(pathname);
    }
}

export default MessageItem;