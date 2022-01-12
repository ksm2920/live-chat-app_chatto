import firebase from "firebase/compat/app";
import { Chat } from "./models/Chat";
import { Message } from "./models/Message";

firebase.initializeApp({
    apiKey: "AIzaSyDCIMYeQ31GnACVPPkx6j4yIXxGWd-uNXY",
    authDomain: "live-chat-app-babf3.firebaseapp.com",
    projectId: "live-chat-app-babf3",
    storageBucket: "live-chat-app-babf3.appspot.com",
    messagingSenderId: "863091774335",
    appId: "1:863091774335:web:cd2f7768de75c0f045004a"
});

firebase.firestore().settings({ experimentalForceLongPolling: true, merge: true });

export class FireClient {
    static db = firebase.firestore();

    static async saveUserIfo(firstmsg: string, chatId: string) {
        if(!FireClient.db)
        return;

        let message = new Message();
        message.text = firstmsg;
        message.isRead = false;
        
        await FireClient.db.collection("chats").doc(chatId)
        .collection("messages").add(Utils.plain(message));
    }

    static async postMessage(text: string, chatId: string, user: firebase.User) {
        if (!FireClient.db)
            return;

        let message = new Message();
        message.text = text;
        message.chatId = chatId;
        message.isRead = false;
        if(user) {
            message.userName = "Agent";
        } else {
            message.userName = "";
        }

        await FireClient.db.collection("chats").doc(chatId)
            .collection("messages").add(Utils.plain(message))
    }

    static subscribeToMessages(chatId: string, handler: (messages: Message[]) => void) {
        if (!FireClient.db)
            return;

        return FireClient.db
            .collection("chats")
            .doc(chatId)
            .collection("messages")
            .orderBy("createdAt")
            .limit(100)
            .onSnapshot((querySnaps) => {
                const messages = querySnaps.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id,
                } as Message))

                handler(messages);
            })
    }

    static subscribeToAllMessages(handler: (messages: Message[]) => void) {
        console.log("#subscribeToAllMessages called");
        
        if (!FireClient.db)
            return;

        return FireClient.db
            .collectionGroup("messages")
            .orderBy("createdAt")
            .limit(1000)
            .onSnapshot((querySnaps) => {
                const messages = querySnaps.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id,
                } as Message))

                handler(messages);
            })
    }

    static subscribeToOngoingChats(handler: (chats: Chat[]) => void) {
        if (!FireClient.db)
            return;

        return FireClient.db
            .collection("chats")
            .where("archived", "==", false)
            .orderBy("created")
            .limit(100)
            .onSnapshot((querySnapshot) => {
                const chats = querySnapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id,
                } as Chat))
                handler(chats);
            })
    }

    static subscribeToArchivedChats(handler: (chats: Chat[]) => void) {
        if (!FireClient.db)
            return;

        return FireClient.db
            .collection("chats")
            .where("archived", "==", true)
            .orderBy("created")
            .limit(100)
            .onSnapshot((querySnapshot) => {
                const chats = querySnapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id,
                } as Chat))
                handler(chats);
            })
    }
}

export class Utils {
    static plain(obj: any) {
        return JSON.parse(JSON.stringify(obj));
    }
}
