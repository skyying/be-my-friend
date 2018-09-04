import React from "react";
import {updateUserData, listenSpecificUserChange} from "./firebase.js";
import {genRandomKey} from "./Common.js";
import SearchFriend from "./SearchFriend.js";
import {Link} from "react-router-dom";

export default class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // id: this.props.id,
      invitationList: null
    };
    console.log("--in user comp constructor ------");
    console.log(this.props.user, this.props.id);
    console.log("--------");
    this.beFriend = this.beFriend.bind(this);
    this.sendInvitation = this.sendInvitation.bind(this);
    this.cancelReq = this.cancelReq.bind(this);
  }
  // componentDidMount() {
  //   this.setState({id: this.props.id});
  //   // listenSpecificUserChange(this.props.id, data => {
  //   //   this.setState({user: data.val()});
  //   // });
  // }
  sendInvitation(friendId) {
    // wrap friendId and reqest;
    let newRequest = {};
    newRequest[friendId] = "待邀請";
    let newInvitation = Object.assign(
      {},
      this.props.user.invitation,
      newRequest,
    );
    let newUserData = Object.assign({}, this.props.user, {
      invitation: newInvitation
    });

    // update invitation Data to firebase
    updateUserData(this.props.id, newUserData);

    updateUserData(friendId + "/invitation/" + this.props.id, "待接受");
  }
  cancelReq(friendId) {
    updateUserData(friendId + "/invitation/" + this.props.id, null);
    updateUserData(this.props.id + "/invitation/" + friendId, null);
  }
  beFriend(friendId) {
    updateUserData(friendId + "/friends/" + this.props.id, true);
    updateUserData(this.props.id + "/friends/" + friendId, true);
    updateUserData(friendId + "/invitation/" + this.props.id, null);
    updateUserData(this.props.id + "/invitation/" + friendId, null);
  }
  render() {
    console.log("-----------user---------");
    console.log(this.props.id, this.props.user);
    console.log("-----------user---------");
    // if no one login, return warning
    if (!this.props.id || !this.props.user) {
      return (
        <div>
          <br /> login first
        </div>
      );
    }
    let inviteList;
    if (this.props.user && this.props.user.invitation) {
      let invitation = this.props.user.invitation;
      inviteList = Object.keys(invitation).map(request => {
        let canBeFriend = invitation[request] !== "待邀請";
        return (
          <div key={genRandomKey()}>
            <div> {request} </div>
            <div> {invitation[request]} </div>
            {canBeFriend && (
              <button
                onClick={() => {
                  this.beFriend(request);
                }}>
                                be-frend
              </button>
            )}
            <button
              onClick={() => {
                this.cancelReq(request);
              }}>
                            cancel
            </button>
            <br />
            <br />
          </div>
        );
      });
    }

    let firendList;

    if (this.props.user && this.props.user.friends) {
      console.log("should print");
      let friends = this.props.user.friends;
      firendList = Object.keys(friends).map(friend => {
        return (
          <div key={genRandomKey()}>
            <div> {friend} </div>
            <div> {friends[friend]} </div>
          </div>
        );
      });
    }

    return (
      <div>
        <Link to="/article">Article</Link>
        <SearchFriend
          send={this.sendInvitation}
          email={this.props.email}
        />
        <div>
          <div>{this.props.user.name}</div>
          <div>{this.props.user.email}</div>
        </div>
        <h2>Invitation list</h2>
        <div>{inviteList}</div>
        <br />
        <h2>Friend list</h2>
        <div>{firendList} </div>
      </div>
    );
  }
}
