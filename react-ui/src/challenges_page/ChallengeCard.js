import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './challenge_page.css';
require('firebase/firestore');


var firebase = require('firebase');
var db = firebase.firestore();

class ChallengeCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            challengerProfilePic: '',
            challengedProfilePic: ''
        };
    };

    componentWillMount() {

        let challengedEmail = "", challengerEmail = "", referThis = this;
    
        //Get the Challenged's email address
        db.collection('nicknames').doc(this.props.challenged).get().then(function (challengedSnap) {
            challengedEmail = challengedSnap.data().email;
            //get the profile picture. 
            db.collection('users').doc(challengedEmail).get().then(function (profile) {
                referThis.setState({
                    challengedProfilePic: profile.data().profilePic
                });
            });
        });

        //get the challenger's email address
        db.collection('nicknames').doc(this.props.challenger).get().then(function (challengerSnap) {
            challengerEmail = challengerSnap.data().email;
            //get the profile picture. 
            db.collection('users').doc(challengerEmail).get().then(function (challengerProfile) {
                referThis.setState({
                    challengerProfilePic: challengerProfile.data().profilePic
                });
            });
        });
    }

    render() {
        const { challenged, challenger,/* challengedVotes, challengerVotes,*/ challengerVideoTitle,
            challengedVideoTitle } = this.props;
        return (
            <div>
                <br />
                <div className="card challengeCard">
                    <div className="card-block">
                        <div className="row">
                            <div className="col-md-6 col-sm-6" style={{ width: 'auto' }} id="photo_row">
                                <img src={this.state.challengerProfilePic}
                                    id="userPhoto" alt={challenger} />
                            </div>
                            <div className="col-md-6 col-sm-6" style={{ width: 'auto' }} id="photo_row">
                                <img src={this.state.challengedProfilePic}
                                    id="userPhoto" alt={challenged} />
                            </div>
                        </div>
                        <br />
                        <div className="challengers">
                            <h4 id="challenger">{challenger}</h4>
                            <p id="videoName">{challengerVideoTitle}</p>
                            <img src="https://firebasestorage.googleapis.com/v0/b/challengemetest-ea2e0.appspot.com/o/line_with_bolt.png?alt=media&token=e1e42f59-ea6b-460b-93ab-5a7d9c4e1037"
                                id="challenger_line" alt="challenger_line" />
                            <h4 id="challenger">{challenged}</h4>
                            <p id="videoName">{challengedVideoTitle}</p>
                        </div>
                    </div>
                    <div className="card-footer">
                        <Link to={`/challenge/${this.props.challengeID}`}>
                            <i className="fas fa-plus"></i> Show Challenge
                        </Link>
                    </div>
                </div>
            </div>
        )
    }
}

export default ChallengeCard;