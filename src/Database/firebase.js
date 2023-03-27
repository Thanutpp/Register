import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

const firebaseConfig = {
    apiKey: "AIzaSyC7NY3b8bIfRGNQx6mfo2uGBltWVBWjhCI",
    authDomain: "project-register-da089.firebaseapp.com",
    projectId: "project-register-da089",
    storageBucket: "project-register-da089.appspot.com",
    messagingSenderId: "92597286232",
    appId: "1:92597286232:web:481e576e873b7969fa212d",
    measurementId: "G-E5HGJ386TL"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
export const firestore = firebaseApp.firestore();
export const auth = firebaseApp.auth();
export const googleProvider = new firebase.auth.GoogleAuthProvider();
export default firestore;