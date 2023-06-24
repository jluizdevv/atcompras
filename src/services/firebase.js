import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBU4Shlhzj4EppW0Z_ZNc74PlVn31SSS-k",
  authDomain: "app-compras-infnet.firebaseapp.com",
  projectId: "app-compras-infnet",
  storageBucket: "app-compras-infnet.appspot.com",
  messagingSenderId: "1098070993802",
  appId: "1:1098070993802:web:de02bc6e3cf19487af7673"
};
  firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export default firebase;
