import React from "react";
import {
  updateUserData,
  getUserField,
  listenSpecificUserChange,
  getUserByKey
} from "./firebase.js";
import {genRandomKey} from "./Common.js";
import SearchFriend from "./SearchFriend.js";
import {Link} from "react-router-dom";
import firebase from "firebase";

export default class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inviteeInfo: null,
      firiendInfo: null
    };
    this.request = {
      sent: "待接受",
      beComfirm: "待邀請"
    };

    this.accept = this.accept.bind(this);
    this.sendInvitation = this.sendInvitation.bind(this);
    this.updateInvitationData = this.updateInvitationData.bind(this);
    this.cancelReq = this.cancelReq.bind(this);
  }
  sendInvitation(friendId) {
    let newRequest = {};
    newRequest[friendId] = this.request.beComfirm;

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

    updateUserData(
      friendId + "/invitation/" + this.props.id,
      this.request.sent,
    );

    this.updateInvitationData();
  }

  updateInvitationData() {
    let user = this.props.user;
    if (!user || !user.invitation) {
      console.log("no user and no user invitation");
      this.setState({invitation: null});
      return;
    }

    // fetch data and set to state
    let invitationList = Object.keys(user.invitation);

    let inviteeInfo = {};

    invitationList.map((inviteeKey, index) => {
      getUserByKey(inviteeKey, snapshot => {
        inviteeInfo[inviteeKey] = snapshot.val();
        if (index === invitationList.length - 1) {
          this.setState({inviteeInfo: inviteeInfo});
        }
      });
    });
  }
  cancelReq(friendId) {
    updateUserData(friendId + "/invitation/" + this.props.id, null);
    updateUserData(this.props.id + "/invitation/" + friendId, null);
  }
  accept(friendId) {
    updateUserData(friendId + "/friends/" + this.props.id, true);
    updateUserData(this.props.id + "/friends/" + friendId, true);
    updateUserData(friendId + "/invitation/" + this.props.id, null);
    updateUserData(this.props.id + "/invitation/" + friendId, null);
  }
  render() {
    console.log("in render-------------");
    console.log(this.props.user, this.state);

    let user = this.props.user;
    let propInvitation = user.invitation,
      invitationList;

    // error handling
    if (!this.props.id || !user) {
      return (
        <div>
          <br /> login first
        </div>
      );
    }
    //

    if (propInvitation && this.state.inviteeInfo) {
      let inviteArr = Object.keys(propInvitation);
      invitationList = inviteArr.map(key => {
        let inviteeInfo = this.state.inviteeInfo;
        let canBeFriend = inviteArr[key] === this.request.sent;
        return (
          <InviteeItem
            key={genRandomKey()}
            cancel={this.cancelReq}
            accept={this.accept}
            itemData={Object.assign(
              {},
              inviteeInfo[key],
              {key: key},
              {canBeFriend: canBeFriend},
            )}
          />
        );
      });
      console.log("------");
      console.log("invitationList", invitationList);
      console.log("------");
    }

    return (
      <div>
        <button onClick={this.updateInvitationData}>click</button>
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
        <div>{invitationList}</div>
        <br />
        <h2>Friend list</h2>
      </div>
    );
  }
}

const InviteeItem = ({itemData, accept, cancel}) => {
  let beFriendBtn = (
      <button onClick={() => accept(itemData.key)}>be friend</button>
    ),
    cancelBtn = (
      <button onClick={() => cancel(itemData.key)}>cancel</button>
    );
  return (
    <div key={genRandomKey()}>
      <div> user </div>
      <div> {itemData.name} </div>
      <div> {itemData.email} </div>
      <div> {itemData.key} </div>
      <div> state </div>
      {itemData.canBeFriend && beFriendBtn}
      {cancelBtn}
    </div>
  );
};

// let inviteList;
// if (
//   this.props.user &&
//         this.props.user.invitation &&
//         this.state.inviteeInfo
// ) {

// let invitation = this.props.user.invitation;
// inviteList = Object.keys(invitation).map(friendKey => {
// let canBeFriend = invitation[friendKey] !== "待邀請";

//   return (
//   );
// });
// }

// let firendList;

// if (this.props.user && this.props.user.friends) {
//   console.log("should print");
//   let friends = this.props.user.friends;
//   firendList = Object.keys(friends).map(friend => {
//     return (
//       <div key={genRandomKey()}>
//         <div> {friend} </div>
//         <div> {friends[friend]} </div>
//       </div>
//     );
//   });
