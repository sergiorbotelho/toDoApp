import firebase from "firebase/app";
import 'firebase/database';
import 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAN0-aqJmhClKslgmzcX3hiNcl8lqyU0-M",
    authDomain: "todoapp-d39e0.firebaseapp.com",
    databaseURL: "https://todoapp-d39e0-default-rtdb.firebaseio.com",
    projectId: "todoapp-d39e0",
    storageBucket: "todoapp-d39e0.appspot.com",
    messagingSenderId: "521585399329",
    appId: "1:521585399329:web:4a028c55b5a800c691b560"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export default firebase;
