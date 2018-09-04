import React from "react";
import PropTypes from "prop-types";
import {genRandomKey} from "./Common.js";
import {updatePost} from "./firebase.js";

class PostArea extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            content: "this is a post content",
            title: "leslie - this is a post title",
            tag: "gossip"
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
        let currentUser = this.props.user && <h3> {this.props.user.name} </h3>;

        //should remove true below"
        let postBtn = !this.props.user.name ? (
            <p>login before post</p>
        ) : (
            <button
                onClick={() => {
                    let date = new Date().getTime();
                    let post = Object.assign(
                        {},
                        this.state,
                        {authorId: this.props.id},
                        {createTime: date},
                    );
                    this.postToFirebase(post);
                }}>
                Post
            </button>
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
                return post.title.match(rex) || post.tag.match(rex);
            });
        }

        if (postList) {
            posts = postList.map(post => {
                return (
                    <div key={genRandomKey()}>
                        <h4>title: {post.title}</h4>
                        <h4>tag: {post.tag}</h4>
                        <h4>author: {post.authorId}</h4>
                        <div>{post.content}</div>
                    </div>
                );
            });
        }
        return (
            <div>
                <h2>Articles</h2>
                <PostArea id={this.props.id} user={this.props.user} />
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
