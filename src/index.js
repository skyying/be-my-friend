import "./style/main.scss";
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
  filterUserByEmail,
  fetchData,
  listenEmailChange,
  listenArticleChange,
  listenUserChange
} from "./comp/firebase.js";
import Login from "./comp/Login.js";
import PostArea from "./comp/PostArea.js";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: null,
      article: null,
      allUserData: null,
      currentUser: null,
      userData: {email: "", name: "", friends: null, invitation: null},
      currentId: null
    };
    initFirebase();
    this.fetchFromFirebase = this.fetchFromFirebase.bind(this);
    this.registerEvent = this.registerEvent.bind(this);
    this.logout = this.logout.bind(this);
    this.updateState = this.updateState.bind(this);
    this.login = this.login.bind(this);
    this.fetchFromFirebase();
    this.registerEvent();
  }

  logout() {
    this.setState({currentId: null});
  }

  updateState(data) {
    this.setState(data);
  }

  login(email) {
    console.log("start login");
    filterUserByEmail(email, snapshot => {
      console.log(email);
      snapshot.forEach(data => {
        if (data.key) {
          console.log("-------", data.key);
          this.setState({
            currentId: data.key,
            userData: data.val()
          });
          return;
        }
      });
      console.log("login failed");
    });
  }
  fetchFromFirebase() {
    fetchData("email").then(email => this.setState({email: email.val()}));
    fetchData("article").then(article =>
      this.setState({article: article.val()}),
    );
  }
  registerEvent() {
    listenUserChange(value => this.setState({allUserData: value.val()}));
    listenArticleChange(value => this.setState({article: value.val()}));
  }

  render() {
    console.log("---------------");
    console.log(this.state);
    console.log("---------------");
    let logoutBtn = this.state.currentId ? (
      <Link onClick={this.logout} to="/">
        <button>logout</button>
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
                    <Login {...props} login={this.login} />
                  );
                }}
              />
              <Route
                exact
                path="/user"
                render={() => (
                  <User
                    allUserData={this.state.allUserData}
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
