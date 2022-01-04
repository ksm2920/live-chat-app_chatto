import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import { useEffect, useRef, useState } from "react";
import { RiCloseFill, RiSendPlaneFill } from "react-icons/ri";
import { FireClient } from "../FireClient";
import { Chat } from "../models/Chat";
import { Message } from "../models/Message";
import ChatItem from "./ChatItem";
import MessageItem from "./MessageItem";
import { FcGoogle } from "react-icons/fc";
import { MdEmail } from "react-icons/md";
import FirebaseUIAuth from "./FirebaseAuthLocalized";

const auth = firebase.auth();

const AgentPage = () => {
    const [show, setShow] = useState(true);
    const [showOngoing, setShowOngoing] = useState(false);
    const [showArchived, setShowArchived] = useState(true);
    const [showLoginForm, setShowLoginForm] = useState(true);
    const [chatId, setChatId] = useState("");
    const [ongoingChats, setOngoingChats] = useState<Chat[]>([]);
    const [archivedChats, setArchivedChats] = useState<Chat[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef<null | HTMLDivElement>(null);
    const [agent, setAgent] = useState(() => auth.currentUser);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        auth.onAuthStateChanged(agent => {
            if (agent) {
                setAgent(agent);
            } else {
                setAgent(null);
            }
        })
        FireClient.subscribeToOngoingChats(chats => {
            setOngoingChats(chats)
        })
        FireClient.subscribeToArchivedChats(chats => {
            setArchivedChats(chats)
        })
    }, [chatId])

    const signInWithGoogle = async () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.useDeviceLanguage();
        try {
            await auth.signInWithRedirect(provider);
        } catch (error) {
            console.log(error)
        }
    }

    const signInWithEmail = async (email: string, password: string) => {
        const cred = firebase.auth.EmailAuthProvider.credential(
            email,
            password
        );
        auth.useDeviceLanguage();
        try {
            await auth.signInWithRedirect(cred);
        } catch (error) {
            console.log(error)
        }
    }

    const signOut = async () => {
        try {
            await firebase.auth().signOut();
        } catch (error: any) {
            console.log(error.message);
        }
    }

    const openChat = (chatId: string) => {
        return FireClient.subscribeToMessages(chatId, (messages) => {
            setMessages(messages);
            scrollToBottom();
        })
    }

    const handelOnSubmit = (e: any) => {
        e.preventDefault();
        FireClient.postMessage(newMessage, chatId, auth.currentUser!);
        setNewMessage("");
    }

    const handleOnChange = (e: any) => {
        setNewMessage(e.target.value);
    }

    const onChangeEmail = (e: any) => {
        setEmail(e.target.value);
    }

    const onChangePassword = (e: any) => {
        setPassword(e.target.value);
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
        {agent ? (
            <div className="wrap">
                <div className="header">
                    <div className="avatar">
                        <img src={"https://cdn.icon-icons.com/icons2/2449/PNG/512/headphones_head_set_chat_live_support_icon_148822.png"} alt="Avatar" width={45} height={45} />
                    </div>
                    <button onClick={signOut}>SIGN OUT</button>
                </div>
                <div className="container">
                    <div className="chat-list-left">
                        <h1>Chats</h1>
                        <div className="chats">
                            <div onClick={showOngoingChats} className={showOngoing ? "normal ongoing" : "selected ongoing"}>Ongoing</div>
                            <div onClick={showArchivedChats} className={showArchived ? "normal archived" : "selected archived"}>Archived</div>
                        </div>
                        <div>
                            <div hidden={showOngoing}>
                                <div className="list">
                                    {ongoingChats.map(c => (
                                        <div key={c.id} onClick={() => { openChat(c.id!); setShow(false); setChatId(c.id!); }} className={chatId === c.id ? "selected" : "normal"}>
                                            <ChatItem chat={c} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div hidden={showArchived}>
                                <div className="list">
                                    {archivedChats.map(c => (
                                        <div key={c.id} onClick={() => { openChat(c.id!); setShow(false); setChatId(c.id!); }} className={chatId === c.id ? "selected" : "normal"}>
                                            <ChatItem chat={c} />
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
                                    <button type="submit" disabled={!newMessage}>
                                        <RiSendPlaneFill />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="clear"></div>

                </div>
                {/* <div className="footer"></div> */}
            </div>
        ) : (
            <>
                <div className="wrap">
                    <div className="header">
                    </div>
                    <div className="container">
                        <div className="login-form">
                            <h1 className="chatto">Chatto</h1>
                            {/* <div className="form">
                                <input type="text" placeholder="email" value={email} onChange={onChangeEmail}/>
                                <input type="text" placeholder="password" value={password} onChange={onChangePassword}/>
                                <button onClick={() => { signInWithEmail(email, password)}} className="email"><span><MdEmail /></span>Sign in with email</button>
                            </div>
                            <div className="inline"><span className="line-left"></span><span className="or">OR</span><span className="line-right"></span></div>
                            <div>
                                <button onClick={signInWithGoogle} className="google"><span><FcGoogle /></span>Sign in with Google</button>
                            </div> */}
                            <FirebaseUIAuth version="4.7.3"/>
                        </div>
                    </div>
                    {/* <div className="footer"></div> */}
                </div>
            </>
        )
        }



    </>

}

export default AgentPage;