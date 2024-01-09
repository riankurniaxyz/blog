// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyCnYOdY7cqR_32q8D5clSoLhGGQffwKN7s",
//   authDomain: "comment-system-87113.firebaseapp.com",
//   projectId: "comment-system-87113",
//   storageBucket: "comment-system-87113.appspot.com",
//   messagingSenderId: "540418577567",
//   appId: "1:540418577567:web:37c77328d1bd5a8b943eaa",
// };

const firebaseConfig = {
  apiKey: "AIzaSyCC9zKXIJIpL8dgsMFEoFRISpqyMLNHeVI",
  authDomain: "riankurnia-pages.firebaseapp.com",
  projectId: "riankurnia-pages",
  storageBucket: "riankurnia-pages.appspot.com",
  messagingSenderId: "458080398890",
  appId: "1:458080398890:web:61e73dfd06d56936c59d53"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
