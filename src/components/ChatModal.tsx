import { useState } from "react";
import { FireClient } from "../FireClient";

const ChatModal = () => {
    const [show, setShow] = useState(true);
    const [chatId, setChatId] = useState("");
    const [newMessage, setNewMessage] = useState("");

    const createNewChat = () => {
        let random = Math.floor(Math.random() * 100) + 1;
        const chatNum = "Chat" + random;
        FireClient.db.collection("chats").doc(chatNum).set({
            id: chatNum,
            created: new Date()
        })
        setChatId(chatNum);
    }

    const handelOnSubmit = (e: any) => {
        e.preventDefault();
        FireClient.postMessage(newMessage, chatId);
        setNewMessage("");
    }

    const handleOnChange = (e: any) => {
        setNewMessage(e.target.value);
    }

    return <div>
        <button onClick={() => {
            createNewChat();
            setShow(false);
        }}>Support</button>
        <div className="chat-box" hidden={show}>
            <h1>{chatId}</h1>
            <form onSubmit={handelOnSubmit} className="message-input">
                <input
                    type="text"
                    value={newMessage}
                    onChange={handleOnChange}
                    placeholder="Write a message"
                />
                <button type="submit" disabled={!newMessage}>
                    Send
                </button>
            </form>
        </div>
    </div>
}

export default ChatModal;