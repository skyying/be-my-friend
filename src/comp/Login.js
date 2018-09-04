import React from "react";
import {filterUserByEmail, setUserData} from "./firebase.js";
import {Link} from "react-router-dom";

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "3@g.com",
      name: ""
      // redirectToReferrer: false,
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
      console.log(this.state.email);
      snapshot.forEach(email => {
        if (email.key) {
          console.log("-------", email.key);
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
    // this.setState({ redirectToReferrer: true })
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

    // const {redirectToReferrer} = this.state;
    // if(redirectToReferrer) {
    //   return <Redirect to={}

    // }
    return (
      <div className="login">
        <h2>Login / Register</h2>
        <div>
          <input
            type="text"
            onChange={this.handleName}
            value={this.state.name}
            placeholder="name"
          />
        </div>
        <div>
          <input
            type="text"
            onChange={this.handleEmail}
            placeholder="email"
            value={this.state.email}
          />
        </div>

        <div>
        {notes}
      </div>
        <div>
        <Link onClick={this.registerUser} to="/user">
          <button disabled={isRegistered}>Register</button>
        </Link>
        <Link
          to="/user"
          onClick={() => this.props.login(this.state.email)}>
          <button disabled={!isRegistered}>login</button>
        </Link>
      </div>
      </div>
    );
  }
}

// disabled={isRegistered}>
