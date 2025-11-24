import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// firebase config - these keys are safe to expose
const firebaseConfig = {
  apiKey: "AIzaSyCI4e5vJwQqdGu9DVm3svcu-nRjSNnybhE",
  authDomain: "acenraai-f99cf.firebaseapp.com",
  projectId: "acenraai-f99cf",
  storageBucket: "acenraai-f99cf.firebasestorage.app",
  messagingSenderId: "565468378508",
  appId: "1:565468378508:web:48171f613ff73bd482d2a9",
  measurementId: "G-44KC4BZF05"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, analytics, auth };