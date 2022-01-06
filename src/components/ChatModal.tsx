import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { useEffect, useRef, useState } from "react";
import { BiSupport } from "react-icons/bi";
import { RiCloseFill, RiSendPlaneFill } from "react-icons/ri";
import { FireClient } from "../FireClient";
import { Message } from "../models/Message";
import MessageItem from "./MessageItem";
const auth = firebase.auth();

const ChatModal = () => {
    const [show, setShow] = useState(true);
    const [showForm, setShowForm] = useState(true);
    const [showBtn, setShowBtn] = useState(false);
    const [showModal, setShowModal] = useState(showChatModal(window.location.pathname));
    const [chatId, setChatId] = useState("");
    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const messagesEndRef = useRef<null | HTMLDivElement>(null)
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userFirstMsg, setUserFirstMsg] = useState("");

    useEffect(() => {
        const chatIdFromLS = localStorage.getItem("chatId")
        if (chatIdFromLS) {
            setChatId(chatIdFromLS!);
            console.log(chatIdFromLS);
            setShow(false);
            setShowBtn(true);
            subscribeMessage(chatIdFromLS);
        } 

    }, [chatId]);

    const createNewChat = () => {
        // const random = Math.floor(Math.random() * 100) + 1
        const id = userName + "_" + userEmail;
        FireClient.db.collection("chats").doc(id).set({
            id: id,
            username: userName,
            email: userEmail,
            created: new Date(),
            archived: false
        })
        FireClient.saveUserIfo(userFirstMsg, id);
        setChatId(id);
        subscribeMessage(id);
        setUserName("");
        setUserEmail("");
        setUserFirstMsg("");
        localStorage.setItem('chatId', id);
    }

    const subscribeMessage = (chatId: string) => {
        return FireClient.subscribeToMessages(chatId, (messages) => {
            setMessages(messages);
            scrollToBottom();
        })
    }

    const handleOnChangeNewMsg = (e: any) => {
        setNewMessage(e.target.value);
    }

    const handleOnChangeUserName = (e: any) => {
        setUserName(e.target.value);
    }

    const handleOnChangeUserEmail = (e: any) => {
        setUserEmail(e.target.value);
    }

    const handleOnChangeUserFirstMsg = (e: any) => {
        setUserFirstMsg(e.target.value);
    }

    const handelOnSubmit = (e: any) => {
        e.preventDefault();
        FireClient.postMessage(newMessage, chatId, auth.currentUser!);
        setNewMessage("");
    }

    const submitUserForm = (e: any) => {
        e.preventDefault();
    }

    const closeChat = async () => {
        await FireClient.db.collection("chats").doc(chatId).update({ archived: true })
        setShow(true);
        setShowBtn(false);
        localStorage.clear();
        // let docRef = await FireClient.db.collection("chats").doc(chatId).collection("messages");
        // docRef.get().then((querySnapshot) => {
        //     Promise.all(querySnapshot.docs.map((d) => d.ref.delete()));
        // })
        // await FireClient.db.collection("chats").doc(chatId).delete();
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    if (showModal)
        return (
            <div className="chat-modal">
                <div className="support-btn" hidden={showBtn}>
                    <button onClick={() => {
                        setShow(false);
                        setShowForm(false);
                        setShowBtn(true);
                    }}><BiSupport /></button>
                </div>
                <div className="chat-box" hidden={show}>
                    <div className="chat-header">
                        {showForm === false ?
                            <div>
                                <button className="leave-btn" onClick={() => { setShow(true); setShowBtn(false); }}><RiCloseFill /></button>
                            </div>
                            :
                            <div>
                                <button className="leave-btn" onClick={closeChat}><RiCloseFill /></button>
                            </div>
                        }
                        {showForm === false ? <h1>Support</h1> : <h1>Chat with us!</h1>}
                    </div>
                    <div className="chat-body">
                        {showForm === false ?
                            <form onSubmit={submitUserForm} className="user-form">
                                <label>Your name</label>
                                <input
                                    type="text"
                                    value={userName}
                                    onChange={handleOnChangeUserName}
                                    id="cy-name"
                                />
                                <label>E-mail</label>
                                <input
                                    type="email"
                                    value={userEmail}
                                    onChange={handleOnChangeUserEmail}
                                    id="cy-email"
                                />
                                <label>Message</label>
                                <textarea
                                    rows={5}
                                    value={userFirstMsg}
                                    onChange={handleOnChangeUserFirstMsg}
                                    id="cy-msg"
                                />
                                <button onClick={() => {
                                    createNewChat();
                                    setShowForm(true);
                                    setShow(false)
                                }}
                                    type="button"
                                    disabled={!userName || !userEmail || !userFirstMsg}
                                    id="cy-send-btn">
                                    Send
                                </button>
                            </form>
                            :
                            <>
                                <ul>
                                    {messages.map(m => (
                                        <li key={m.id}>
                                            <MessageItem message={m} />
                                        </li>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </ul>
                            </>
                        }

                    </div>
                    {showForm === false ?
                        <></>
                        :
                        <div className="message-input">
                            <form onSubmit={handelOnSubmit}>
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={handleOnChangeNewMsg}
                                    placeholder="Write a message"
                                />
                                <button type="submit" disabled={!newMessage}>
                                    <RiSendPlaneFill />
                                </button>
                            </form>
                        </div>}
                </div>
            </div>
        )
    else
        return <></>

    function showChatModal(pathname: string) {
        return ["/"].includes(pathname);
    }
}

export default ChatModal;