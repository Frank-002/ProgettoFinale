// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "bytebeat-new-ddc53.firebaseapp.com",
  projectId: "bytebeat-new-ddc53",
  storageBucket: "bytebeat-new-ddc53.appspot.com",
  messagingSenderId: "522552274084",
  appId: "1:522552274084:web:da36019a637d302a194a31"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

//apiKey: import.meta.env.VITE_FIREBASE_API_KEY