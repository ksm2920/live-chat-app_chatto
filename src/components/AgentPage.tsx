import { useEffect, useState } from "react";
import { FireClient } from "../FireClient";
import { Chat } from "../models/Chat";
import { Message } from "../models/Message";
import MessageItem from "./MessageItem";

const AgentPage = () => {
    const [show, setShow] = useState(true);
    const [chatId, setChatId] = useState("");
    const [ongoingChats, setOngoingChats] = useState<Chat[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    useEffect(() => {
        return FireClient.subscribeToChats(chats => {
            setOngoingChats(chats)
        })
    },[chatId])
    
    const openChat = (chatId: string) => {
        return FireClient.subscribeToMessages(chatId, (messages) => {
            setMessages(messages);
        })
    }

    const handelOnSubmit = (e: any) => {
        e.preventDefault();
        FireClient.postMessage(newMessage, chatId);
        setNewMessage("");
    }

    const handleOnChange = (e: any) => {
        setNewMessage(e.target.value);
    }

    return <>
        <h1>Agent page</h1>
        <ul>
            {ongoingChats.map(c => (
                <li key={c.id}>
                    <button onClick={() => {openChat(c.id!); setShow(false); setChatId(c.id!)}}>{c.id}</button>
                </li>
            ))}
        </ul>
        <div className="chat-box" hidden={show}>
            <div className="chat-header">
                <div>
                    {/* <button className="leave-btn" onClick={deleteChat}>X</button> */}
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
                {/* <div ref={messagesEndRef} /> */}
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

    </>

}

export default AgentPage;