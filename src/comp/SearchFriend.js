import React from "react";
import {hasValueInObj} from "./Common.js";

export default class SearchFriend extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ""
        };
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(e) {
        this.setState({value: e.currentTarget.value});
    }
    render() {
        let isSearchUserExist = hasValueInObj(
            this.props.email,
            this.state.value,
        );
        return (
            <div>
                <br />
                <h2>Search friend</h2>
                <input
                    placeholder="user email"
                    onChange={this.handleChange}
                    value={this.state.value}
                />
                <button
                    onClick={() => {
                        this.props.send(this.state.value);
                    }}
                    disabled={!isSearchUserExist}>
                    add
                </button>
            </div>
        );
    }
}
