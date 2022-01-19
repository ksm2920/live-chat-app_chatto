import { format } from "date-fns";
import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import React from "react";
import { useEffect, useRef, useState } from "react";
import { FiList, FiLogOut } from "react-icons/fi";
import { RiCloseFill, RiSendPlaneFill } from "react-icons/ri";
import { FireClient } from "../FireClient";
import { Chat } from "../models/Chat";
import { Message } from "../models/Message";
import ChatItem from "./ChatItem";
import FirebaseUIAuth from "./FirebaseAuthLocalized";
import MessageItem from "./MessageItem";

const auth = firebase.auth();
let unsubscriberMessages: () => void = () => { console.log("unsubbing nothing"); }

const AgentPage = () => {
    const [show, setShow] = useState(true);
    const [showOngoing, setShowOngoing] = useState(false);
    const [showArchived, setShowArchived] = useState(true);
    const [currentChatId, setCurrentChatId] = useState("");
    const [ongoingChats, setOngoingChats] = useState<Chat[]>([]);
    const [archivedChats, setArchivedChats] = useState<Chat[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [unreadMessages, setunreadMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef<null | HTMLDivElement>(null);
    const [agent, setAgent] = useState(() => auth.currentUser);
    const [isActive, setActive] = useState(false);
    const chatIdFromLS = localStorage.getItem("chatId");

    useEffect(() => {
        auth.onAuthStateChanged(agent => {
            if (agent) {
                setAgent(agent);
            } else {
                setAgent(null);
            }
        });
        FireClient.subscribeToOngoingChats(chats => {
            setOngoingChats(chats)
        });
        FireClient.subscribeToArchivedChats(chats => {
            setArchivedChats(chats)
        });
        FireClient.subscribeToUnreadMessages((unreadMsg) => {
            setunreadMessages(unreadMsg);
            console.log('subscribeToUnreadMessages received', unreadMsg);
            // let nrOfUnread = 0;
            // unreadMsg.map((m) => {
            //     nrOfUnread += m.isRead ? 0 : 1;
            // });
            // console.log('unreadmsgs.length', nrOfUnread);
        });


    }, []);

    const signOut = async () => {
        try {
            await firebase.auth().signOut();
        } catch (error: any) {
            console.log(error.message);
        }
    }

    const openChat = (chatId: string) => {
        localStorage.setItem("chatId", chatId);
        setCurrentChatId(chatId);
        subscribeMessage(chatId);
        // setToReadMessages(allMessages, chatId);
        // console.log(allMessages);
        // isReadMessages(chatId);
    }

    const subscribeMessage = (chatId: string) => {
        unsubscriberMessages();
        unsubscriberMessages = () => { console.log("resetted") }

        let unsub = FireClient.subscribeToMessages(chatId, (messages) => {
            console.log('subscribeToMessages received', messages);
            setMessages(messages);
            // setToReadMessages(messages, chatId);
            messages.forEach((m) => {
                if (m.isRead === false) {
                    FireClient.updateMessageIsRead(chatId, m.id!, true);
                    // m.isRead = true;
                }
            });
            scrollToBottom();
        });

        if (unsub)
            unsubscriberMessages = unsub!;
    }

    const handelOnSubmit = (e: any) => {
        e.preventDefault();
        let chatIdFromLS = localStorage.getItem("chatId");
        FireClient.postMessage(newMessage, currentChatId, auth.currentUser!, chatIdFromLS!);
        setNewMessage("");
    }

    const handleOnChange = (e: any) => {
        setNewMessage(e.target.value);
    }

    const archiveChat = async () => {
        await FireClient.db.collection("chats").doc(currentChatId).update({ archived: true })
        setShow(true);
        localStorage.clear();
    }

    const showOngoingChats = () => {
        setShowOngoing(false)
        setShowArchived(true)
        setShow(true);
        localStorage.clear();
    }

    const showArchivedChats = () => {
        setShowArchived(false)
        setShowOngoing(true)
        setShow(true);
        localStorage.clear();
        unsubscriberMessages();
        setCurrentChatId("")
    }

    const showChatList = () => {
        handleToggle();
        setShow(true);
        unsubscriberMessages();
        setCurrentChatId("");
        localStorage.clear();
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    const handleToggle = () => {
        setActive(!isActive);
    }

    return <>
        {agent ? (
            <div className="wrap">
                <div className="header">
                    <button onClick={showChatList} className="list-icon">
                        <FiList />
                        {currentChatId !== chatIdFromLS ?
                            <span>{unreadMessages.length}</span>:
                            <span>{unreadMessages.filter(m => m.chatId !== chatIdFromLS).length}</span>}
                    </button>
                    <button onClick={signOut} className="sign-out"><FiLogOut /></button>
                </div>
                <div className="container">
                    <div className={isActive ? "open" : "chat-list-left"}>
                        <h1>Chats</h1>
                        <div className="chats">
                            <div onClick={showOngoingChats} className={showOngoing ? "normal ongoing" : "selected ongoing"}>Ongoing</div>
                            <div onClick={showArchivedChats} className={showArchived ? "normal archived" : "selected archived"}>Archived</div>
                        </div>
                        <div>
                            <div hidden={showOngoing}>
                                <div className="list">
                                    {ongoingChats.map(c => (
                                        <div key={c.id} onClick={() => { openChat(c.id!); setShow(false); setActive(false) }} className={currentChatId === c.id ? "selected" : "normal"} id="cy-ongoing">
                                            <ChatItem chat={c} nrUnread={currentChatId == c.id ? 0 : unreadMessages.filter(m => m.chatId == c.id).length} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div hidden={showArchived}>
                                <div className="list">
                                    {archivedChats.map(c => (
                                        <div key={c.id} onClick={() => { openChat(c.id!); setShow(false); setActive(false) }} className={currentChatId === c.id ? "selected" : "normal"}>
                                            <ChatItem chat={c} nrUnread={currentChatId == c.id ? 0 : unreadMessages.filter(m => m.chatId == c.id).length} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="chat-box-right">
                        <div className="chat-box-agent" hidden={show}>
                            <div className="chat-header">
                                <div>
                                    <button className="leave-btn" onClick={archiveChat}><RiCloseFill /></button>
                                </div>
                                <h1 className="chat-id">{currentChatId}</h1>
                            </div>
                            <div className="chat-body">
                                <ul>
                                    {getMessages(messages)}
                                </ul>
                            </div>
                            <div className="message-input">
                                <form onSubmit={handelOnSubmit}>
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={handleOnChange}
                                        placeholder="Write a message"
                                    />
                                    <button type="submit" disabled={!newMessage}>
                                        <RiSendPlaneFill />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="clear"></div>
                </div>
            </div>
        ) : (
            <>
                <div className="wrap">
                    <div className="header">
                    </div>
                    <div className="container">
                        <div className="login-form">
                            <h1 className="chatto">Chatto</h1>
                            <FirebaseUIAuth version="4.7.3" />
                        </div>
                    </div>
                </div>
            </>
        )
        }
    </>

    function getMessages(messages: Message[]) {
        let lastDate = "";
        return messages.map(m => {
            let msgDate = format(new Date(m.createdAt), "MM/dd/yy");
            if (lastDate == msgDate)
                msgDate = "";
            else
                lastDate = msgDate;

            console.log('msgDate is', msgDate);

            return (
                <React.Fragment key={m.id}>
                    {<div><div className="date"> {msgDate}</div></div>}
                    <li>
                        <MessageItem message={m} />
                    </li>
                    <div ref={messagesEndRef} />
                </React.Fragment>
            )
        })
    }

}

export default AgentPage;