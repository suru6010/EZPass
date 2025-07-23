// client/src/utils/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDBN83JfCdoJR3Yk1Jr88HB-O_cckeHgA0",
  authDomain: "ezpass-dfd86.firebaseapp.com",
  projectId: "ezpass-dfd86",
  storageBucket: "ezpass-dfd86.appspot.com",
  messagingSenderId: "934838157618",
  appId: "1:934838157618:web:0139dc0a9bf75f3c6fd72b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase Auth
export const auth = getAuth(app);
