// Import the Firebase modules that you need in your app.   
import firebase from 'firebase/app'; 
import 'firebase/auth';
import 'firebase/database';

// Initalize and export Firebase.
const config = {
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    authDomain: "hack-a-mole-1.firebaseapp.com",
    databaseURL: "https://hack-a-mole-1.firebaseio.com",
    projectId: "hack-a-mole-1",
    storageBucket: "hack-a-mole-1.appspot.com",
    messagingSenderId: "952616545086"
}; 
const checking = firebase.initializeApp(config); 
export default checking;