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
    }, [chatId])

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
        <div className="wrap">
            <div className="header"></div>
            <div className="container">
                <div className="left">
                <h1>Chats</h1>
                    <h2>Ongoing chats</h2>
                    <div>
                        {ongoingChats.map(c => (
                            <div key={c.id} onClick={() => { openChat(c.id!); setShow(false); setChatId(c.id!) }}>
                                {c.id}
                            </div>
                        ))}
                    </div>

                </div>
                <div className="right">
                    <div className="chat-box-agent" hidden={show}>
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
                </div>
                <div className="clear"></div>

            </div>
            <div className="footer"></div>


        </div>


    </>

}

export default AgentPage;