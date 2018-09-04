import React from "react";
import {updateUserData} from "./firebase.js";
import {genRandomKey} from "./Common.js";
import SearchFriend from "./SearchFriend.js";
import {Link} from "react-router-dom";

const request = {
  sent: "待接受",
  beComfirm: "待邀請"
};

export default class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inviteeInfo: null,
      friendInfo: null
    };

    this.request = {
      sent: "待接受",
      beComfirm: "待邀請"
    };

    this.accept = this.accept.bind(this);
    this.sendInvitation = this.sendInvitation.bind(this);
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
  }
  // updateFriendData() {
  //   let user = this.props.user;
  //   if (!user || !user.friends) {
  //     console.log("no user and no friends");
  //     this.setState({friendInfo: null});
  //     return;
  //   }

  //   // fetch data and set to state
  //   let friendList = Object.keys(user.friends);

  //   let friendInfo = {};

  //   friendList.map((key, index) => {
  //     getUserByKey(key, snapshot => {
  //       friendInfo[key] = snapshot.val();
  //       if (index === friendList.length - 1) {
  //         this.setState({friendInfo: friendInfo});
  //       }
  //     });
  //   });
  // }
  // updateInvitationData() {
  //   let user = this.props.user;
  //   if (!user || !user.invitation) {
  //     console.log("no user and no user invitation");
  //     this.setState({invitation: null});
  //     return;
  //   }

  //   // fetch data and set to state
  //   let invitationList = Object.keys(user.invitation);

  //   let inviteeInfo = {};

  //   invitationList.map((inviteeKey, index) => {
  //     getUserByKey(inviteeKey, snapshot => {
  //       inviteeInfo[inviteeKey] = snapshot.val();
  //       if (index === invitationList.length - 1) {
  //         this.setState({inviteeInfo: inviteeInfo});
  //       }
  //     });
  //   });
  // }
  cancelReq(friendId) {
    updateUserData(friendId + "/invitation/" + this.props.id, null);
    updateUserData(this.props.id + "/invitation/" + friendId, null);
  }
  accept(friendId) {
    updateUserData(friendId + "/friends/" + this.props.id, true);
    updateUserData(this.props.id + "/friends/" + friendId, true);
    updateUserData(friendId + "/invitation/" + this.props.id, null);
    updateUserData(this.props.id + "/invitation/" + friendId, null);
    // this.updateFriendData();
  }
  render() {
    let user = this.props.user;
    let allUserData = this.props.allUserData;

    // error handling
    if (!this.props.id || !user) {
      return (
        <div>
          <Link to="/">
            <button className="btn">login page</button>
          </Link>
        </div>
      );
    }

    const lists = {
      friends: "friends",
      invitation: "invitation"
    };

    const getList = type => {
      if (user && user[lists[type]] && allUserData) {
        let rawData = user[lists[type]];
        let objToArray = Object.keys(rawData);
        return objToArray.map(key => {
          let canBeFriend, canBeCancel;
          if (type === lists.invitation) {
            canBeFriend = rawData[key] !== this.request.sent;
            canBeCancel = true;
          }
          return (
            <ListItem
              key={genRandomKey()}
              cancel={this.cancelReq}
              accept={this.accept}
              itemData={Object.assign(
                {},
                allUserData[key],
                {key: key},
                {canBeFriend: canBeFriend},
                {request: rawData[key]},
                {canBeCancel: canBeCancel},
              )}
            />
          );
        }); // end of map
      }
    };

    let invitationList = getList(lists.invitation);
    let friendList = getList(lists.friends);

    return (
      <div className="user">
        <div>
          <Link to="/article">
            <button className="btn"> All articles </button>
          </Link>

          <Link to="/post">
            <button className="btn"> New post </button>
          </Link>
        </div>
        <div className="userText">
          <div className="name"> {this.props.user.name}</div>
          <div className="mail"> mail: {this.props.user.email}</div>
        </div>
        <div>
          <SearchFriend
            send={this.sendInvitation}
            email={this.props.email}
          />
        </div>
        <div>
          <h2>Invitation list</h2>
          <div>{invitationList || "No invitation"}</div>
        </div>
        <div>
          <h2>Friend list</h2>
          <div>{friendList || "No friends"}</div>
        </div>
      </div>
    );
  }
}

const ListItem = ({itemData, accept, cancel}) => {
  let status =
        itemData.request === request.sent ? (
          <span className="status">request sent</span>
        ) : (
          <span className="status"> comfirm request </span>
        );
  let beFriendBtn = (
      <button onClick={() => accept(itemData.key)}>be friend</button>
    ),
    cancelBtn = (
      <button className="btn" onClick={() => cancel(itemData.key)}>
                cancel
      </button>
    );
  return (
    <div className="list-item" key={genRandomKey()}>
      <div className="name">
        {" "}
        {itemData.name} {itemData.canBeCancel && status}{" "}
      </div>
      <div className="mail"> {itemData.email} </div>
      {itemData.canBeFriend && beFriendBtn}
      {itemData.canBeCancel && cancelBtn}
    </div>
  );
};
