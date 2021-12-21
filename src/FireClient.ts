import firebase from "firebase/compat/app";
import { Message } from "./models/Message";

firebase.initializeApp({
    apiKey: "AIzaSyDCIMYeQ31GnACVPPkx6j4yIXxGWd-uNXY",
    authDomain: "live-chat-app-babf3.firebaseapp.com",
    projectId: "live-chat-app-babf3",
    storageBucket: "live-chat-app-babf3.appspot.com",
    messagingSenderId: "863091774335",
    appId: "1:863091774335:web:cd2f7768de75c0f045004a"
});

export class FireClient {
    static db = firebase.firestore();

    static async postMessage(text: string, chatId: string) {
        if(!FireClient.db) 
        return;

        let message = new Message();
        message.text = text;
        message.chatId = chatId;

        await FireClient.db.collection("chats").doc(chatId)
        .collection("messages").add(Utils.plain(message))
    }
}

export class Utils {
    static plain(obj: any) {
        return JSON.parse(JSON.stringify(obj));
    }
}
