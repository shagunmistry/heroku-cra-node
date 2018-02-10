import React, { Component } from 'react';
import './App.css';
import Navigationbar from '../navigation/Navigation';
import Hometrend from '../homepage/Hometrend';
import OngoingChallenges from '../challenges_page/OngoingChallenges';
import ProfileCheck from '../profile_page_comp/ProfileCheck';
import Profilepage from '../profile_page_comp/Profile_page';
import EditProfile from '../profile_page_comp/EditProfile';
import UploadVideo from '../uploadPage/UploadVideo';
import FollowersPage from '../profile_stats/FollowersPage';
import ChallengePage from '../challenges_page/ChallengePage';
import Comments from '../comment/Comments';

import firebaseApp from '../firebase/Firebase';

import { BrowserRouter as Router, Route } from 'react-router-dom';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      /*  message: null,
        fetching: true */
      loggedIn: false
    };
  }

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

  //Check if the user is logged in or not
  componentWillMount() {
    var referThis = this;
    firebaseApp.auth().onAuthStateChanged(function (user) {
      if (user) {
        referThis.setState({
          loggedIn: true
        });
      }
    });
  }
  render() {

    return (
      <div className="App">
        <Navigationbar />
        <Router>
          <div>
            <Route exact path="/" component={Hometrend} />
            <Route exact path="/Hometrend" component={Hometrend} />
            <Route exact path="/trending-challenges" component={OngoingChallenges} />
            <Route path="/challenge/:challengeid" component={ChallengePage} />
            <Route exact path="/check_user_status" component={ProfileCheck} />
            <Route path="/users/:nickname" component={Profilepage} />
            <Route exact path="/EditProfile" component={EditProfile} />
            <Route exact path="/Upload" component={UploadVideo} />
            <Route exact path="/stats" component={FollowersPage} />
            <Route path="/videos/:videoid" component={Comments} />
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