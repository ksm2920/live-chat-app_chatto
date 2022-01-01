import { FunctionComponent } from "react";
import { Chat } from "../models/Chat";


type ChatProps = {
    chat: Chat
}
const ChatItem: FunctionComponent<ChatProps> = ({ chat }) => {
    return (
        <div className="chat-item">
            {chat.id}
        </div>
    )
}

export default ChatItem;