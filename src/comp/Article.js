import React from "react";
import PropTypes from "prop-types";
import {genRandomKey} from "./Common.js";
import {updatePost} from "./firebase.js";
import {Link} from "react-router-dom";

export default class Articles extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword: ""
    };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e) {
    this.setState({keyword: e.currentTarget.value});
  }
  render() {
    let posts,
      postList,
      articles = this.props.article;

    if (articles) {
      postList = Object.values(articles);

      postList = postList.filter(post => {
        const rex = new RegExp(this.state.keyword, "gi");
        return (
          post.title.match(rex) ||
                    post.tag.match(rex) ||
                    post.author.match(rex)
        );
      });
    }

    if (postList) {
      posts = postList.map(post => {
        return (
          <div key={genRandomKey()}>
            <h4>title: {post.title}</h4>
            <h4>tag: {post.tag}</h4>
            <h4>author: {post.author}</h4>
            <div>{post.content}</div>
          </div>
        );
      });
    }
    return (
      <div>
        <Link to="/user"> go back </Link>
        <Link to="/post"> new post </Link>

        <h2>Articles</h2>
        <h2>All Posts</h2>
        <div>
          <label>search : </label>
          <input
            placeholder="search some post"
            onChange={this.handleChange}
            value={this.state.keyword}
          />
        </div>
        {posts}
      </div>
    );
  }
}
