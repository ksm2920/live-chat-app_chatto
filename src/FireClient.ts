import firebase from 'firebase/compat/app';

firebase.initializeApp({
    apiKey: "AIzaSyDFvQIVM6V335N_Gpro2aXE4hD54kGYyk0",
    authDomain: "realtime-chat-ddb80.firebaseapp.com",
    projectId: "realtime-chat-ddb80",
    storageBucket: "realtime-chat-ddb80.appspot.com",
    messagingSenderId: "125714120463",
    appId: "1:125714120463:web:13d64b1f5541ed2d17c87a"
});

export class FireClient {
    static db = firebase.firestore();
}

