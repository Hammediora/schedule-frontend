// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDm0d0lHZCqvBm0qutWbpJjPKZzhtr4Z8s",
  authDomain: "scheduleapp-12e02.firebaseapp.com",
  databaseURL: "https://scheduleapp-12e02-default-rtdb.firebaseio.com",
  projectId: "scheduleapp-12e02",
  storageBucket: "scheduleapp-12e02.appspot.com",
  messagingSenderId: "124864009420",
  appId: "1:124864009420:web:93e48411660ff199d71e69",
  measurementId: "G-GGNFNSJB02"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase Authentication
export const auth = getAuth(app)