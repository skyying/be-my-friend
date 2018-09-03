import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import firebase from "firebase";

class SearchFriend extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "",
            registered: null
        };
        this.database = this.props.database;
        this.updateRegisterUser = this.updateRegisterUser.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.fetchRegisterUser = this.fetchRegisterUser.bind(this);
        this.fetchRegisterUser();
        this.updateRegisterUser();
    }
    handleChange(e) {
        this.setState({value: e.currentTarget.value});
    }
    updateRegisterUser() {
        let monitering = firebase.database().ref("email/");
        monitering.on("value", function(value) {
            console.log("emails", value.val());
        });
        // console.log(this.database.ref("email"));
        //   this.database
        //       .ref("email")
        //       .on("value")
        //       .then(res => this.setState({registered: res.val()}));
    }
    fetchRegisterUser() {
        this.database
            .ref("email")
            .once("value")
            .then(res => this.setState({registered: res.val()}));
    }
    render() {
        console.log("state in search", this.state);
        let serachResult, canMakeFriend, friendId;
        if (!this.state.registered) {
            console.log("not fetched");
            serachResult = <div> still searching</div>;
        } else {
            console.log("fetched");
            console.log(this.state);
            let emails = this.state.registered;
            canMakeFriend = Object.keys(emails).filter(mail => {
                console.log(this.state.value);
                console.log(emails[mail].email);
                if (emails[mail].email === this.state.value) {
                    friendId = mail;
                }
                return emails[mail].email === this.state.value;
            });
        }
        if (canMakeFriend && canMakeFriend.length) {
            serachResult = (
                <button onClick={() => this.props.add(friendId)}>add me</button>
            );
        }
        console.log("serachResult", serachResult);
        return (
            <div>
                <h2>Enter your friend's email</h2>
                <input value={this.state.value} onChange={this.handleChange} />
                {serachResult}
            </div>
        );
    }
}
// <button onClick={this.updateRegisterUser}>Search</button>

export default SearchFriend;
