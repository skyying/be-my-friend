import React from "react";
import {filterUserByEmail, setUserData} from "./firebase.js";

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      name: ""
    };
    this.handleName = this.handleName.bind(this);
    this.handleEmail = this.handleEmail.bind(this);
    this.login = this.login.bind(this);
    this.registerUser = this.registerUser.bind(this);
  }
  handleName(e) {
    this.setState({name: e.currentTarget.value});
  }
  handleEmail(e) {
    this.setState({email: e.currentTarget.value});
  }
  login() {
    console.log("start login");
    filterUserByEmail(this.state.email, snapshot => {
      snapshot.forEach(email => {
        if (email.key) {
          this.props.update({
            currentId: email.key,
            userData: email.val()
          });
          return;
        }
      });
      console.log("login failed");
    });
  }
  registerUser() {
    // push user data to firebase
    let key = setUserData({
      email: this.state.email,
      name: this.state.name,
      firends: [],
      invitation: []
    });
    // push data to email on firebase
    // setNewEmailData(key, this.state.email);

    //reset Input
    this.setState({name: "", email: ""});
    this.props.update({currentId: key});
  }
  render() {
    let notes = null,
      isRegistered = false;
    // checking if existing user
    filterUserByEmail(this.state.email, function(snapshot) {
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
        <h2>okay</h2>
        <input
          type="text"
          onChange={this.handleName}
          value={this.state.name}
          placeholder="name"
        />
        <input
          type="text"
          onChange={this.handleEmail}
          placeholder="email"
          value={this.state.email}
        />
        <button onClick={this.registerUser} disabled={isRegistered}>
                    Register
        </button>
        <button onClick={this.login}> login </button>
        {notes}
      </div>
    );
  }
}
