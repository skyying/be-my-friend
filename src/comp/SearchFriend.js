import React from "react";
import {filterUserByEmail} from "./firebase.js";

export default class SearchFriend extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      userKey: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.clearinput = this.clearinput.bind(this);
  }
  clearinput() {
    this.setState({value: ""});
  }
  handleChange(e) {
    this.setState({value: e.currentTarget.value});

    filterUserByEmail(e.currentTarget.value, snapshot => {
      let isUserkey = false;
      snapshot.forEach(email => {
        if (email.key) {
          console.log("xxxxxxxxxxxxxxx", snapshot.val());
          this.setState({
            userKey: email.key
          });
          isUserkey = true;
          return;
        }
      });
      if (!isUserkey) {
        this.setState({userKey: null});
      }
    });

    console.log(this.state);
  }
  render() {
    return (
      <div>
        <br />
        <h2>Search friend</h2>
        <input
          placeholder="user email"
          onChange={this.handleChange}
          value={this.state.value}
        />
        <button
          onClick={() => {
            this.props.send(this.state.userKey);
            this.clearinput();
          }}
          disabled={!this.state.userKey}>
                    add
        </button>
      </div>
    );
  }
}
