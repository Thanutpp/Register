import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCMCcyAdPPx9mJcphk0JSWhF9VB1oGelRU",
    authDomain: "register-eef64.firebaseapp.com",
    projectId: "register-eef64",
    storageBucket: "register-eef64.appspot.com",
    messagingSenderId: "1056260758388",
    appId: "1:1056260758388:web:62d5a6cade9766fd82ea21",
    measurementId: "G-9B6H5JW4ST"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
export const firestore = firebaseApp.firestore();
export const auth = firebaseApp.auth();
export const googleProvider = new firebase.auth.GoogleAuthProvider();
export default firestore;