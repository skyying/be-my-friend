import React from "react";
import PropTypes from "prop-types";
import {updatePost} from "./firebase.js";
import {Link} from "react-router-dom";

export default class PostArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: "",
      title: "",
      tag: ""
    };
    this.handleChangeTitle = this.handleChangeTitle.bind(this);
    this.handleChangeContent = this.handleChangeContent.bind(this);
    this.postToFirebase = this.postToFirebase.bind(this);
    this.handleChangeTag = this.handleChangeTag.bind(this);
  }
  handleChangeTitle(e) {
    this.setState({title: e.currentTarget.value});
  }
  handleChangeTag(e) {
    this.setState({tag: e.currentTarget.value});
  }
  handleChangeContent(e) {
    this.setState({content: e.currentTarget.value});
  }
  postToFirebase(article) {
    updatePost(article);
  }
  render() {
    console.log("------in post area------");
    console.log(this.props.id, this.props.user);
    console.log("------------");
    if (!this.props.id || !this.props.user) return <div>not login yet</div>;
    let currentUser = this.props.user && <h3> {this.props.user.name} </h3>;

    //should remove true below"
    let postBtn = !this.props.user.name ? (
      <p>login before post</p>
    ) : (
      <Link
        onClick={() => {
          let date = new Date().getTime();
          let post = Object.assign(
            {},
            this.state,
            {authorId: this.props.id},
            {author: this.props.user.name},
            {createTime: date},
          );
          this.postToFirebase(post);
        }}
        to="/article">
                Post
      </Link>
    );
    return (
      <div>
        {currentUser}
        <div>
          <input
            placeholder="title"
            value={this.state.title}
            onChange={this.handleChangeTitle}
            type="text"
          />
        </div>
        <div>
          <input
            placeholder="tag"
            value={this.state.tag}
            onChange={this.handleChangeTag}
            type="text"
          />
        </div>
        <div>
          <input
            row="10"
            cols="10"
            value={this.state.content}
            onChange={this.handleChangeContent}
            type="textarea"
          />
          {postBtn}
        </div>
      </div>
    );
  }
}
