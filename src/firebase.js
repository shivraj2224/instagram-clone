import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDqwj5mppdH-FXUfqb1_P9LWV3b5zl7I2M",
    authDomain: "instagram-clone-36ff7.firebaseapp.com",
    databaseURL: "https://instagram-clone-36ff7.firebaseio.com",
    projectId: "instagram-clone-36ff7",
    storageBucket: "instagram-clone-36ff7.appspot.com",
    messagingSenderId: "1056285809922",
    appId: "1:1056285809922:web:b2cb2634b2af54f21f761b",
    measurementId: "G-GGXF6DJGH0"
  });

  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();

  export { db, auth, storage };