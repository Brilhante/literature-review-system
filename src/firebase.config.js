// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC-FYeJeefVq4wZx_6MgjuekWEmZ7PJwmo",
  authDomain: "literature-db.firebaseapp.com",
  projectId: "literature-db",
  storageBucket: "literature-db.firebasestorage.app",
  messagingSenderId: "464800926699",
  appId: "1:464800926699:web:75697ea1c43135df8ea7ae",
  measurementId: "G-6QH8FRWP3R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics only on client side
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { app, analytics }; 