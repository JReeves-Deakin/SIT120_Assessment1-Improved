import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import firebase from "firebase/app"; //Firebase is used for authentication, file storage and as a database 
require('firebase/auth');
import store from "./store" //Stores login state

// Firebase data
var firebaseConfig = {
    apiKey: "AIzaSyCPUOZUPWQdjtFgo5N0pFDe7go4iflGs3E",
    authDomain: "test-8a575.firebaseapp.com",
    projectId: "test-8a575",
    storageBucket: "test-8a575.appspot.com",
    messagingSenderId: "1063752078390",
    appId: "1:1063752078390:web:755f4515b429e32e7a3497"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//When the user logs in or out, send them to the approproate page

firebase.auth().onAuthStateChanged(user => {
    if (user) { // user has signed in, set the variables
        store.dispatch("loginUser", {
            email: user.email //pass the users email as data
        })
        router.replace({ name: "Dashboard" }); //Send user to the dashboard once variables have been set

    } else { // User has signed out, remove the variables
        store.dispatch("logoutUser")
        router.replace({ name: "Login" }); //Send user to the dashboard once variables have been set
    }
});

createApp(App).use(router).mount('#app')