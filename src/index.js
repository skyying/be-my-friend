import "./style/main.scss";
import React from "react";
import ReactDOM from "react-dom";
import firebase from "firebase";
import SearchFriend from "./comp/SearchFriend.js";
import User from "./comp/User.js";
// import {initFirebase} from "./comp/constant.js";

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

const setField = field => data => {
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

const setNewEmailData = (key, data) => {
    firebase
        .database()
        .ref("email/" + key)
        .set(data);
};

let setUserData = setField("users");

const getField = field => action => {
    return firebase
        .database()
        .ref(field)
        .on("value", action);
};

let listenEmailChange = getField("email");
let listenArticleChange = getField("article");

const fetchData = field => {
    return firebase
        .database()
        .ref(field)
        .once("value");
};

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: null,
            article: null,
            currentUser: null,
            emailInput: "",
            nameInput: "",
            currentId: ""
        };
        initFirebase();
        this.fetchFromFirebase = this.fetchFromFirebase.bind(this);
        this.changeNameInput = this.changeNameInput.bind(this);
        this.changeEmailInput = this.changeEmailInput.bind(this);
        this.registerEvent = this.registerEvent.bind(this);
        this.registerUser = this.registerUser.bind(this);
        this.isExistingUser = this.isExistingUser.bind(this);
        this.fetchFromFirebase();
        this.registerEvent();
    }
    fetchFromFirebase() {
        fetchData("email").then(email => this.setState({email: email.val()}));
        fetchData("article").then(article =>
            this.setState({article: article.val()}),
        );
    }
    registerEvent() {
        listenEmailChange(value => this.setState({email: value.val()}));
        listenArticleChange(value => this.setState({article: value.val()}));
    }
    isExistingUser() {
        let allUserEmail = this.state.email;
        for (let key in allUserEmail) {
            if (allUserEmail[key] === this.state.emailInput) {
                return true;
            }
        }
        return false;
    }
    registerUser() {
        // push user data to firebase
        let key = setUserData({
            email: this.state.emailInput,
            name: this.state.nameInput,
            firends: [],
            invitation: []
        });

        // push data to email on firebase
        setNewEmailData(key, this.state.emailInput);

        //reset Input
        this.setState({nameInput: "", emailInput: ""});
    }
    changeNameInput(e) {
        this.setState({nameInput: e.currentTarget.value});
    }
    changeEmailInput(e) {
        this.setState({emailInput: e.currentTarget.value});
    }
    render() {
        console.log(this.state);
        let notes = null,
            isRegistered = false;
        // checking if existing user
        if (this.isExistingUser()) {
            isRegistered = true;
            notes = <h4>Already registered</h4>;
        }
        return (
            <div>
                <div>
                    <h2>Register</h2>
                    <input
                        type="text"
                        onChange={this.changeNameInput}
                        value={this.state.nameInput}
                        placeholder="name"
                    />
                    <input
                        type="text"
                        onChange={this.changeEmailInput}
                        placeholder="email"
                        value={this.state.emailInput}
                    />
                    <button onClick={this.registerUser} disabled={isRegistered}>
                        Register
                    </button>
                    <button> login </button>
                    {notes}
                </div>

                <User
                    id={this.state.currentId}
                    emails={this.state.email}
                    articles={this.state.article}
                />
            </div>
        );
    }
}

// class User extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             name: "",
//             email: "",
//             firends: {},
//             invitation: {},
//         };
//     }
//     render() {
//         return <div>user</div>;
//     }
// }

// class App extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             email: null,
//             user: {
//                 name: "",
//                 email: "",
//                 friends: []
//             }
//         };
//         initFirebase();
//         this.database = firebase.database();
//         this.writeUserData = this.writeUserData.bind(this);
//         this.printUserInfoWhenChange = this.printUserInfoWhenChange.bind(this);
//         this.handleEmail = this.handleEmail.bind(this);
//         this.handleFriendEmail = this.handleFriendEmail.bind(this);
//         this.handleName = this.handleName.bind(this);
//         this.validateEmail = this.validateEmail.bind(this);
//         this.fetchEmailDataOnce = this.fetchEmailDataOnce.bind(this);
//         this.writeEmailData = this.writeEmailData.bind(this);
//         this.addFriend = this.addFriend.bind(this);
//         this.fetchEmailDataOnce();
//     }
//     printUserInfoWhenChange(id) {
//         let monitering = firebase.database().ref("users/" + id);
//         monitering.on("value", function(value) {
//             console.log("user data", value.val());
//         });
//     }
//     addFriend(friendId) {
//         console.log("friendId", friendId);
//     }
//     handleFriendEmail(e) {
//         this.setState({friendEmail: e.currentTarget.value});
//     }
//     fetchEmailDataOnce(field) {
//         this.database
//             .ref(field)
//             .once("value")
//             .then(res => {
//                 let allEmail = res.val().email;
//                 return this.setState({email: allEmail});
//             });
//     }
//     validateEmail(email) {
//         this.fetchEmailDataOnce("email");
//     }
//     handleName(e) {
//         let newUserData = Object.assign({}, this.state.user, {
//             name: e.currentTarget.value
//         });
//         this.setState({user: newUserData});
//     }
//     handleEmail(e) {
//         let newUserData = Object.assign({}, this.state.user, {
//             email: e.currentTarget.value
//         });
//         this.setState({user: newUserData});
//     }
//     writeEmailData(key) {
//         let newData = {};
//         newData[key] = this.state.user.email;
//         console.log("newData", newData);
//         this.database.ref("email/" + key).set(newData);
//     }
//     writeUserData() {
//         var newUserKey = firebase
//             .database()
//             .ref()
//             .child("users")
//             .push().key;
//         console.log("newUserKey", newUserKey);
//         this.database.ref("users/" + newUserKey).set({
//             firends: {
//                 user_id_05: {value: true},
//                 user_id_06: {value: true}
//             },
//             invitation: {
//                 user_id_01: {value: true},
//                 user_id_02: {value: false}
//             },
//             name: this.state.user.name,
//             email: this.state.user.email
//         });
//         this.printUserInfoWhenChange(newUserKey);
//         this.writeEmailData(newUserKey);
//     }
//     render() {
//         console.log(this.state);

//         let emailList;
//         if (!this.state.email) {
//             emailList = "no email";
//             // } else {
//             //     emailList = Object.keys(this.state.email).map(email => {
//             //         return <p> {this.state.email[email]} </p>;
//             //     });
//         } else {
//             console.log(this.state.email);
//         }

//         return (
//             <div>
//                 <div>
//                     <h2>Register</h2>
//                     <input
//                         value={this.state.user.name}
//                         placeholder="name"
//                         onChange={this.handleName}
//                     />
//                     <input
//                         placeholder="email"
//                         value={this.state.user.email}
//                         onChange={this.handleEmail}
//                     />
//                     <button
//                         onClick={() => {
//                             this.writeUserData(
//                                 this.state.user.name,
//                                 this.state.user.email,
//                             );
//                         }}>
//                         register
//                     </button>
//                 </div>
//                 <SearchFriend add={this.addFriend} database={this.database} />
//                 <div>{emailList}</div>
//             </div>
//         );
//     }
// }

ReactDOM.render(<App />, document.getElementById("main"));
