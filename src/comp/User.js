import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import {
    fetchData,
    updateUserData,
    listenSpecificUserChange
} from "./firebase.js";
import {getKeyByValue, genRandomKey} from "./Common.js";
import SearchFriend from "./SearchFriend.js";

export default class User extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            invitationList: null
        };

        // this.fetchUserData = this.fetchUserData.bind(this);
        this.beFriend = this.beFriend.bind(this);
        this.sendInvitation = this.sendInvitation.bind(this);
        this.cancelReq = this.cancelReq.bind(this);
        console.log("should fetch data");
        // this.fetchUserData();

        // udpate user data if being update
        listenSpecificUserChange(this.props.id, data => {
            this.setState({user: data.val()});
        });
    }
    // fetchUserData() {
    //     console.log("in User Comp,fetchUserData this.props.id", this.props.id);
    //     if (this.props.id) {
    //         fetchData(`users/${this.props.id}`).then(data =>
    //             this.setState({
    //                 user: Object.assign({}, this.state.user, data.val())
    //             }),
    //         );
    //     }
    // }
    sendInvitation(email) {
        let friendId = getKeyByValue(this.props.email, email);

        // wrap friendId and reqest
        let newRequest = {};
        newRequest[friendId] = "pending";

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
            "to_be_comfirmed",
        );

        console.log(this.props.user.invitation);
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
        // if no one login, return warning
        console.log("in user", this.state);
        console.log("in user comp, this.props.id", this.props.id);

        if (!this.props.id) {
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
                let canBeFriend = invitation[request] !== "pending";
                console.log("canBeFriend", canBeFriend);
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

// const Friend = data => {
//     console.log("firend", data);
//     return (
//         <div>
//             {data.name}
//             {data.email}
//         </div>
//     );
// };
