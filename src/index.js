// import "./style/main.scss";
import React from "react";
import ReactDOM from "react-dom";
import firebase from "firebase";
import SearchFriend from "./comp/SearchFriend.js";
import User from "./comp/User.js";
import Articles from "./comp/Article.js";
import {
  initFirebase,
  fetchData,
  listenEmailChange,
  listenArticleChange
} from "./comp/firebase.js";
import Login from "./comp/Login.js";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: null,
      article: null,
      currentUser: null,
      userData: {email: "", name: "", friends: null, invitation: null},
      currentId: ""
    };
    initFirebase();
    this.fetchFromFirebase = this.fetchFromFirebase.bind(this);
    this.registerEvent = this.registerEvent.bind(this);
    this.updateState = this.updateState.bind(this);
    this.fetchFromFirebase();
    this.registerEvent();
  }

  updateState(data) {
    this.setState(data);
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

  render() {
    return (
      <div>
        <div>
          <Login update={this.updateState} />
        </div>
        <User
          user={this.state.userData}
          id={this.state.currentId}
          email={this.state.email}
          article={this.state.article}
        />
        <Articles
          article={this.state.article}
          id={this.state.currentId}
          user={this.state.userData}
        />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("main"));
