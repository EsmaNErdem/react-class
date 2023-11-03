import React from "react";
import axios from "axios";
import Joke from "./Joke";

class JokeList extends React.Component {
    static defaultProps = {
        numJokesToGet: 10
    }

    state = {
        jokes: []
    }

    // constructor(props) {
    //     super(props);
    // }    

    componentDidMount() {
        if (this.state.jokes.length < this.props.numJokesToGet) this.getJokes();
    }

    componentDidUpdate() {
        if (this.state.jokes.length < this.props.numJokesToGet) this.getJokes();
    }

    async getJokes() {
        let j = this.state.jokes;
        let jokeVotes = JSON.parse(window.localStorage.getItem("jokeVotes") || "{}") 
        let seenJokes = new Set(j.map(joke => joke.id));
        try {
          while (j.length < this.props.numJokesToGet) {
            let res = await axios.get("https://icanhazdadjoke.com", {
              headers: { Accept: "application/json" }
            });
            let { status, ...jokeObj } = res.data;
    
            if (!seenJokes.has(jokeObj.id)) {
              seenJokes.add(jokeObj.id);
              jokeVotes[jokeObj.id] = jokeVotes[jokeObj.id] || 0
              j.push({ ...jokeObj, votes: jokeVotes[jokeObj.id], lock:false });
            } else {
              console.error("duplicate found!");
            }
          }
          this.setState({jokes: j});
          window.localStorage.setItem("jokeVotes", JSON.stringify(jokeVotes))
        } catch (e) {
          console.log(e);
        }
    }

    generateNewJokes = () => {
        this.setState(state => (
            {jokes: state.jokes.filter(j => j.lock === true)}
        ));
    }

    vote = (id, delta) => {
        try {
            let jokeVote = JSON.parse(window.localStorage.getItem("jokeVotes")) 
            jokeVote[id] = (jokeVote[id] || 0) + delta
            window.localStorage.setItem("jokeVotes", JSON.stringify(jokeVote))
            this.setState(allJokes =>(
                {jokes: allJokes.jokes.map(j => (j.id === id ? { ...j, votes: j.votes + delta } : j))})
            );  
        } catch (e) {
          console.log(e);
        }
      
    }

    resetVote = () => {
        window.localStorage.setItem("jokeVotes", "{}")
        this.setState(state => (
            {jokes: state.jokes.map(j => ({...j, votes:0}))}
        ));
    }

    toggleLock = (id) => {
        this.setState(allJokes =>(
            {jokes: allJokes.jokes.map(j =>(j.id === id ? {...j, lock:!j.lock} : j))})
        );
    }

    render () {
        let sortedJokes = [...this.state.jokes].sort((a, b) => b.votes - a.votes);

        return (
            <div className="JokeList">
              <button className="JokeList-getmore" onClick={this.generateNewJokes}>
                Get New Jokes
              </button>
              <button onClick={this.resetVote}> 
                Reset Votes
              </button>
        
              {sortedJokes.map(j => (
                <Joke text={j.joke} key={j.id} id={j.id} votes={j.votes} vote={this.vote} lock={this.toggleLock}/>
              ))}

              {sortedJokes.length < this.props.numJokesToGet ? 
                <div>LOADING...</div> : null          
                }
            </div>
          );
    }
     
}

export default JokeList;

