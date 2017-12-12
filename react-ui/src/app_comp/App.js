import React, { Component } from 'react';
import './App.css';
import Navigationbar from '../navigation/Navigation';
import Hometrend from '../homepage/Hometrend';
import OngoingChallenges from '../challenges_page/OngoingChallenges';
import { BrowserRouter as Router, Route } from 'react-router-dom';


class App extends Component {
  /* constructor(props) {
     super(props);
     this.state = {
       message: null,
       fetching: true
     };
   } */

  /*componentDidMount() {
    fetch('/api').then(response => {
      if (!response.ok) {
        throw new Error(`status ${response.status}`);
      }
      return response.json();
    })
      .then(json => {
        this.setState({
          message: json.message,
          fetching: false
        });
      }).catch(e => {
        this.setState({
          message: `API call failed: ${e}`,
          fetching: false
        });
      })
  } */

  render() {
    return (
      <div className="App">
        <Navigationbar />

        <Router>
          <div>
            <Route exact path="/" component={Hometrend} />
            <Route exact path="/Hometrend" component={Hometrend} />
            <Route exact path="/trending-Challenges" component={OngoingChallenges} />
          </div>
        </Router>
      </div>
    );
  }
}

export default App;

          /* <p className="App-intro">
          {'This is '}
          <a href="https://github.com/mars/heroku-cra-node">
            {'create-react-app with a custom Node/Express server'}
          </a><br />
        </p>
        <p className="App-intro">
          {this.state.fetching ? 'Fetching message from API' : this.state.message}
        </p> */