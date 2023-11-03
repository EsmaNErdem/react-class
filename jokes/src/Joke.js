import React from "react";

class Joke extends React.Component {
    constructor(props) {
        super(props);
        this.upVote = this.upVote.bind(this);
        this.downVote = this.downVote.bind(this);
        this.toggleVote = this.toggleVote.bind(this)
    }

    upVote () {
        this.props.vote(this.props.id, +1)
    }

    downVote () {
        this.props.vote(this.props.id, -1)
    }

    toggleVote () {
        this.props.lock(this.props.id)
    }

    render() {
        return (
            <div className="Joke">
                <div className="Joke-votearea">
                    <button onClick={this.toggleVote}>
                        Save Joke
                    </button>
                    <button onClick={this.upVote}>
                    +
                    </button>

                    <button onClick={this.downVote}>
                    -
                    </button>

                    {this.props.votes}
                </div>

                <div className="Joke-text">{this.props.text}</div>
            </div>
        )
    }
}

export default Joke;