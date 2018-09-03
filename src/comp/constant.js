import firebase from "firebase";

export const initFirebase = () => {
    var config = {
        apiKey: "AIzaSyAZWmB1nTjQVnSIaFylL3TICAnY_l7DRXM",
        authDomain: "be-my-friend.firebaseapp.com",
        databaseURL: "https://be-my-friend.firebaseio.com",
        projectId: "be-my-friend",
        storageBucket: "be-my-friend.appspot.com",
        messagingSenderId: "981772721378"
    };
    firebase.initializeApp(config);
};
