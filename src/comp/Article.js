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
          <div className="post" key={genRandomKey()}>
          <h5>{post.author} 說</h5>
            <h6>{post.title}</h6>
            <div>{post.content}</div>
            <h4><span>{post.tag}</span></h4>
          </div>
        );
      });
    }
    return (
      <div>

        <Link to="/user"> <button className="btn"> Profile </button> </Link>
        <Link to="/post"> <button className="btn"> New Post </button> </Link>

        <h2>Articles</h2>
        <div>
          <input
            type="text"
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
