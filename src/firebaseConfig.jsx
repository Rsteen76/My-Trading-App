// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBVN9rBrxeR0iRuLr6LuEWdR0ORXYR9BLs",
  authDomain: "trade-tracker-a2fbb.firebaseapp.com",
  databaseURL: "https://trade-tracker-a2fbb-default-rtdb.firebaseio.com",
  projectId: "trade-tracker-a2fbb",
  storageBucket: "trade-tracker-a2fbb.firebasestorage.app",
  messagingSenderId: "495453050530",
  appId: "1:495453050530:web:475e19b82af533a94de9fb",
  measurementId: "G-C5D56F2WX9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);