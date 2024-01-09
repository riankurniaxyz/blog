// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCnYOdY7cqR_32q8D5clSoLhGGQffwKN7s",
  authDomain: "comment-system-87113.firebaseapp.com",
  projectId: "comment-system-87113",
  storageBucket: "comment-system-87113.appspot.com",
  messagingSenderId: "540418577567",
  appId: "1:540418577567:web:37c77328d1bd5a8b943eaa"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
