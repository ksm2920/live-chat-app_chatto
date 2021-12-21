import firebase from "firebase/compat/app";

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
}

