import { useRef, useState } from "react";
import { FireClient } from "../FireClient";
import { Message } from "../models/Message";
import MessageItem from "./MessageItem";

const ChatModal = () => {
    const [show, setShow] = useState(true);
    const [showBtn, setShowBtn] = useState(false);
    const [chatId, setChatId] = useState("");
    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const messagesEndRef = useRef<null | HTMLDivElement>(null)

    const createNewChat = () => {
        let random = Math.floor(Math.random() * 100) + 1;
        const chatNum = "Chat " + random;
        FireClient.db.collection("chats").doc(chatNum).set({
            id: chatNum,
            created: new Date()
        })
        setChatId(chatNum);
        subscribeMessage(chatNum);
    }

    const subscribeMessage = (chatId: string) => {
        return FireClient.subscribeToMessages(chatId, (messages) => {
            setMessages(messages);
            scrollToBottom();
        })
    }

    const handleOnChange = (e: any) => {
        setNewMessage(e.target.value);
    }

    const handelOnSubmit = (e: any) => {
        e.preventDefault();
        FireClient.postMessage(newMessage, chatId);
        setNewMessage("");
    }

    const deleteChat = async () => {
        let docRef = await FireClient.db.collection("chats").doc(chatId).collection("messages");
        docRef.get().then((querySnapshot) => {
            Promise.all(querySnapshot.docs.map((d) => d.ref.delete()));
        })
        await FireClient.db.collection("chats").doc(chatId).delete();
        window.location.reload();
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth"});
    }
    return <div className="chat-modal">
        <div className="support-btn" hidden={showBtn}>
            <button onClick={() => {
                createNewChat();
                setShow(false);
                setShowBtn(true);
            }}>Support</button>
        </div>
        <div className="chat-box" hidden={show}>
            <div className="chat-header">
                <div>
                    <button className="leave-btn" onClick={deleteChat}>X</button>
                </div>
                <h1>{chatId}</h1>
            </div>
            <div className="chat-body">
                <ul>
                    {messages.map(m => (
                        <li key={m.id}>
                            <MessageItem message={m} />
                        </li>
                    ))}
                </ul>
                <div ref={messagesEndRef} />
            </div>
           
            <div className="message-input">
                <form onSubmit={handelOnSubmit}>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={handleOnChange}
                        placeholder="Write a message"
                    />
                    {/* <button type="submit" disabled={!newMessage}>
                        Send
                    </button> */}
                </form>
            </div>

        </div>
    </div>
}

export default ChatModal;