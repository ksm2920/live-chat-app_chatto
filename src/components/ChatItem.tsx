import { FunctionComponent } from "react";
import { Chat } from "../models/Chat";


type ChatProps = {
    chat: Chat,
    nrUnread: number
}
const ChatItem: FunctionComponent<ChatProps> = ({ chat, nrUnread }) => {
    return (
        <div className="chat-item">
            {chat.id} {nrUnread > 0 && <span>{nrUnread}</span>}
        </div>
    )
}

export default ChatItem;