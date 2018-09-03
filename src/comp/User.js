import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

export default class User extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            email: "",
            name: "",
            friends: null,
            invitation: null
        };
    }
    render() {
      return <div />
    }
}
