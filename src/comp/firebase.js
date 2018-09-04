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

export const filterUserByEmail = (email, cb) => {
  return firebase
    .database()
    .ref("users")
    .orderByChild("email")
    .equalTo(email)
    .on("value", cb);
};

export const setField = field => data => {
  let key = firebase
    .database()
    .ref()
    .child(field)
    .push().key;

  firebase
    .database()
    .ref(field + "/" + key)
    .set(data);

  return key;
};

export const updateUserData = (key, data) => {
  firebase
    .database()
    .ref("users/" + key)
    .set(data);
};

export const updatePost = article => {
  firebase
    .database()
    .ref("article/")
    .push(article);
};
export const setUserData = setField("users");

export const getField = field => action => {
  return firebase
    .database()
    .ref(field)
    .on("value", action);
};

export const listenSpecificUserChange = (field, action) => {
  return firebase
    .database()
    .ref("users/" + field)
    .on("value", action);
};

export const listenEmailChange = getField("email");
export const listenArticleChange = getField("article");

export const fetchData = field => {
  return firebase
    .database()
    .ref(field)
    .once("value");
};
