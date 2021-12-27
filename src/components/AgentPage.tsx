import { useEffect, useRef, useState } from "react";
import { FireClient } from "../FireClient";
import { Chat } from "../models/Chat";
import { Message } from "../models/Message";
import MessageItem from "./MessageItem";

const AgentPage = () => {
    const [show, setShow] = useState(true);
    const [showOngoing, setShowOngoing] = useState(false);
    const [showArchived, setShowArchived] = useState(true);
    const [chatId, setChatId] = useState("");
    const [ongoingChats, setOngoingChats] = useState<Chat[]>([]);
    const [archivedChats, setArchivedChats] = useState<Chat[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    useEffect(() => {
        FireClient.subscribeToOngoingChats(chats => {
            setOngoingChats(chats)
        })
        FireClient.subscribeToArchivedChats(chats => {
            setArchivedChats(chats)
        })
    }, [chatId])

    const openChat = (chatId: string) => {
        return FireClient.subscribeToMessages(chatId, (messages) => {
            setMessages(messages);
            scrollToBottom();
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

    const archiveChat = async () => {
        await FireClient.db.collection("chats").doc(chatId).update({ archived: true })
        setShow(true);
    }

    const showOngoingChats = () => {
        setShowOngoing(false)
        setShowArchived(true)
        setShow(true);
    }

    const showArchivedChats = () => {
        setShowArchived(false)
        setShowOngoing(true)
        setShow(true);
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    return <>
        <div className="wrap">
            <div className="header"></div>
            <div className="container">
                <div className="chat-list-left">
                    <h1>Chats</h1>
                    <div>
                        <div onClick={showOngoingChats} className={showOngoing ? "normal ongoing" : "selected ongoing"}>Ongoing</div>
                        <div onClick={showArchivedChats} className={showArchived ? "normal archived" : "selected archived"}>Archived</div>
                    </div>
                    <div hidden={showOngoing}>
                        <div className="list">
                            {ongoingChats.map(c => (
                                <div key={c.id} onClick={() => { openChat(c.id!); setShow(false); setChatId(c.id!);}} className={chatId === c.id? "selected": "normal"}>
                                    {c.id}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div hidden={showArchived}>
                        <div className="list">
                            {archivedChats.map(c => (
                                <div key={c.id} onClick={() => { openChat(c.id!); setShow(false); setChatId(c.id!);}} className={chatId === c.id? "selected": "normal"}>
                                    {c.id}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="chat-box-right">
                    <div className="chat-box-agent" hidden={show}>
                        <div className="chat-header">
                            <div>
                                <button className="leave-btn" onClick={archiveChat}>X</button>
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
                <div className="clear"></div>

            </div>
            {/* <div className="footer"></div> */}
        </div>


    </>

}

export default AgentPage;