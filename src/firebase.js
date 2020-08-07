import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyANm2BHBk-6x2gOmEjMDKtCmesDeMuO0Z8",
  authDomain: "instagram-clone-200fb.firebaseapp.com",
  databaseURL: "https://instagram-clone-200fb.firebaseio.com",
  projectId: "instagram-clone-200fb",
  storageBucket: "instagram-clone-200fb.appspot.com",
  messagingSenderId: "528685036197",
  appId: "1:528685036197:web:aa7a402c2602c0fffc134c",
  measurementId: "G-WJPCSK0XNQ",
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
