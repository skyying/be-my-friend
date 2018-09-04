import "./style/main.scss";
import React from "react";
import ReactDOM from "react-dom";
import firebase from "firebase";
import SearchFriend from "./comp/SearchFriend.js";
import User from "./comp/User.js";
import {
    initFirebase,
    fetchData,
    listenEmailChange,
    setNewEmailData,
    listenArticleChange,
    filterUserByEmail,
    setUserData
} from "./comp/firebase.js";
// import {initFirebase} from "./comp/constant.js";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: null,
            article: null,
            currentUser: null,
            emailInput: "",
            nameInput: "",
            userData: {email: "", name: "", friends: null, invitation: null},
            currentId: ""
        };
        initFirebase();
        this.fetchFromFirebase = this.fetchFromFirebase.bind(this);
        this.changeNameInput = this.changeNameInput.bind(this);
        this.changeEmailInput = this.changeEmailInput.bind(this);
        this.registerEvent = this.registerEvent.bind(this);
        this.registerUser = this.registerUser.bind(this);
        this.login = this.login.bind(this);
        this.fetchFromFirebase();
        this.registerEvent();
    }
    fetchUserData() {
        if (this.state.currentId) {
            fetchData(`users/${this.state.currentId}`).then(data =>
                this.setState({
                    userData: Object.assign(
                        {},
                        this.state.userData,
                        data.val(),
                    )
                }),
            );
        }
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

        //
        // firebase.database().ref("users/" + "/asdfasdf").on("value",
        // fucntion (value) {
        //   return this.setState({email: value.val())
        // }

        // );

        // var action = fucntion (value) {
        //   return this.setState({email: value.val())
        // }

        // listenEmailChange( action  );
    }
    login() {
        console.log("click login");

        filterUserByEmail(this.state.emailInput, snapshot => {
            snapshot.forEach(email => {
                if (email.key) {
                    console.log(email.key, email.val());
                    this.setState({
                        currentId: email.key,
                        userData: email.val()
                    });
                    console.log("login successfully");

                    return;
                }
            });

            console.log("login failed");
        });

        // let id = getKeyByValue(this.state.email, this.state.emailInput);
        // if (!id) {
        //     console.log("no this user");
        // } else {
        //     console.log("it here");
        //     this.setState({currentId: id});
        // }
        // this.emailInput
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
        this.setState({nameInput: "", emailInput: "", currentId: key});
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

        let abc = filterUserByEmail("22@g.com", function(snapshot) {
            snapshot.forEach(email => {
                return email.key;
            });
        });

        // check if user already register
        filterUserByEmail(this.state.emailInput, function(snapshot) {
            snapshot.forEach(email => {
                if (email.key) {
                    isRegistered = true;
                    notes = <h4>Already registered</h4>;
                }
                return email.key;
            });
        });

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
                    <button onClick={this.login}> login </button>
                    {notes}
                </div>
                <User
                    user={this.state.userData}
                    id={this.state.currentId}
                    email={this.state.email}
                    article={this.state.article}
                />
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById("main"));
