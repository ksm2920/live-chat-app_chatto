import { useState } from "react";
import { FireClient } from "../FireClient";

const ChatModal = () => {
    const [show, setShow] = useState(true);
    const [chatId, setChatId] = useState("");

    const createNewChat = () => {
        let random = Math.floor(Math.random() * 100) + 1;
        const chatNum = "Chat" + random;
        FireClient.db.collection("chats").doc(chatNum).set({
            id: chatNum,
            created: new Date()
        })
        setChatId(chatNum);
    }

    return <div>
        <button onClick={() => {
            createNewChat();
            setShow(false);
        }}>Support</button>
        <div className="chat-box" hidden={show}>
        <h1>Chat modal</h1>
        </div>
    </div>
}

export default ChatModal;