// import "./style/main.scss";

import React from "react";
import ReactDOM from "react-dom";
import firebase from "firebase";
import {
  IndexRoute,
  BrowserRouter,
  Router,
  Route,
  Link,
  Switch
} from "react-router-dom";
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
import PostArea from "./comp/PostArea.js";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: null,
      article: null,
      currentUser: null,
      userData: {email: "", name: "", friends: null, invitation: null},
      currentId: null
    };
    initFirebase();
    this.fetchFromFirebase = this.fetchFromFirebase.bind(this);
    this.registerEvent = this.registerEvent.bind(this);
    this.logout = this.logout.bind(this);
    this.updateState = this.updateState.bind(this);
    this.fetchFromFirebase();
    this.registerEvent();
  }

  logout() {
    this.setState({currentId: null});
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
    console.log("---------------");
    console.log(this.state);
    console.log("---------------");
    let logoutBtn = this.state.currentId ? (
      <Link onClick={this.logout} to="/">
                logout
      </Link>
    ) : null;

    return (
      <div>
        <BrowserRouter>
          <div>
            {logoutBtn}
            <Switch>
              <Route
                path="/"
                exact
                render={props => {
                  return (
                    <Login
                      {...props}
                      update={this.updateState}
                    />
                  );
                }}
              />
              <Route
                exact
                path="/user"
                render={() => (
                  <User
                    user={this.state.userData}
                    id={this.state.currentId}
                    email={this.state.email}
                    article={this.state.article}
                  />
                )}
              />
              <Route
                path="/post"
                render={() => {
                  return (
                    <PostArea
                      id={this.state.currentId}
                      user={this.state.userData}
                    />
                  );
                }}
              />
              <Route
                path="/article"
                exact
                render={props => (
                  <Articles
                    {...props}
                    article={this.state.article}
                    id={this.state.currentId}
                    user={this.state.userData}
                  />
                )}
              />
            </Switch>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("main"));

