import React, { Component } from 'react';
//import { Link } from 'react-router-dom';
import { Player } from 'video-react';
import './challenge_page.css';

require('firebase/firestore');
var firebase = require('firebase');
var db = firebase.firestore(), counterLimiter = 6;

class ChallengePage extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            challenger: "",
            challenged: "",
            challengedPic: "",
            challengerPic: "",
            challengerVotes: 0,
            challengedVotes: 0,
            challengerVideo: "",
            challengedVideo: ""
        });

        this.voteButton = this.voteButton.bind(this);
    }

    componentWillMount() {
        //get the information
        let videoRef = db.collection('challenges').doc(this.props.match.params.challengeid), referThis = this;

        //Challenger Information
        let challenger = "", challengerVotes = 0, challengerVideoTitle = "", challengerVideo;

        //Challenged Information
        let challenged = "", challengedVotes = 0, challengedVideoTitle = "", challengedVideo;

        videoRef.onSnapshot(function (voteQuery) {
            challengerVotes = voteQuery.data().challengerVotes;
            challengedVotes = voteQuery.data().challengedVotes;
            referThis.setState({
                challengerVotes: challengerVotes,
                challengedVotes: challengedVotes,
            });
        }, function (error) {
            console.error(error.message);
        });

        videoRef.get().then(function (eachVideo) {
            challenger = eachVideo.data().challenger;
            //challengerVotes = eachVideo.data().challengerVotes;
            challengerVideoTitle = eachVideo.data().challengerVideoTitle;
            challengerVideo = eachVideo.data().challengerVideoURL;

            challenged = eachVideo.data().challenged;
            //challengedVotes = eachVideo.data().challengedVotes;
            challengedVideoTitle = eachVideo.data().challengedVideoTitle;
            challengedVideo = eachVideo.data().challengedVideoURL;

        }).then(function () {
            //On success
            referThis.setState({
                challenger: challenger,
                challenged: challenged,

                challengerVideo: challengerVideo,
                challengedVideo: challengedVideo
            });

            let challengerEmail = "", challengedEmail = "";
            //get the picture information
            //Get the Challenged's email address
            db.collection('nicknames').doc(referThis.state.challenged).get().then(function (challengedSnap) {
                challengedEmail = challengedSnap.data().email;
                //get the profile picture. 
                db.collection('users').doc(challengedEmail).get().then(function (profile) {
                    console.log(profile.data().profilePic);
                    referThis.setState({
                        challengedPic: profile.data().profilePic
                    });
                });
            }).catch(function () {
                console.log("There was an error getting the picture information");
            });

            //get the challenger's email address
            db.collection('nicknames').doc(referThis.state.challenger).get().then(function (challengerSnap) {
                challengerEmail = challengerSnap.data().email;
                //get the profile picture. 
                db.collection('users').doc(challengerEmail).get().then(function (challengerProfile) {
                    referThis.setState({
                        challengerPic: challengerProfile.data().profilePic
                    });

                });
            });

        }).catch(function (error) {
            window.alert("There was an error getting this Challenge's information!");
        });


    }


    //Vote button
    voteButton(decider) {
        //Check if the user has already voted 
        //If so, decrement the counter, if not, increment the counter. 
        //Do it under challengedVotes or ChallengerVotes based on who it is
        let voteForThis = "", counter = 0;
        counterLimiter--;
        if (counterLimiter <= 0) {
            //The person isn't allowed to vote anymore. 
            window.alert("You have used up all 6 of your votes for this challenge");
        } else {
            let voteConnection = db.collection('challenges').doc(this.props.match.params.challengeid), referThis = this;
            if (decider === this.state.challenger) {
                voteForThis = 'challengerVotes';
                counter = this.state.challengerVotes;
                voteConnection.get().then(function (querySnapshot) {
                    counter += 1;
                    voteConnection.set({
                        challengerVotes: counter
                    }, { merge: true })
                }).catch(function (error) {
                    console.log("There was an error submitting this vote!");
                });
            } else {
                voteForThis = 'challengedVotes';
                counter = this.state.challengedVotes;
                voteConnection.get().then(function (querySnapshot) {
                    counter += 1;
                    voteConnection.set({
                        challengedVotes: counter
                    }, { merge: true })
                }).catch(function (error) {
                    console.log("There was an error submitting this vote!");
                });
            }

        }





    }
    render() {
        const state = this.state;
        return (
            <div>
                <h3 style={{ marginTop: '10px' }}>Who did it better?</h3>
                <div className="row" id="voteRow">
                    <div className="col-md-6" id="voteCol">
                        <img className="voteButton" src={state.challengerPic}
                            id="userPhoto" alt={state.challenger} onClick={() => this.voteButton(state.challenger.toString())} />
                        <p>{state.challengerVotes}</p>
                    </div>
                    <div className="col-md-6" id="voteCol">
                        <img className="voteButton" src={state.challengedPic}
                            id="userPhoto" alt={state.challenged} onClick={() => this.voteButton(state.challenged.toString())} />
                        <p>{state.challengedVotes}</p>
                    </div>
                </div>
                <div className="card" id="challengerCard">
                    <h5 className="card-header">Challenger 1: </h5>
                    <div className="card-block">
                        <Player id="challengerVideo" src={state.challengerVideo}
                        ></Player>
                        <div className="infoSection">
                            <div>
                                <img src={state.challengerPic}
                                    id="userPhoto" alt={state.challenger} />
                            </div>
                            <div>
                                <h5>{state.challenger}</h5>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="card" id="challengerCard">
                        <h5 className="card-header">Challenger 2: </h5>
                        <div className="card-block">
                            <Player id="challengerVideo" src={state.challengedVideo}
                            ></Player>
                        </div>
                        <div className="infoSection">
                            <div>
                                <img src={state.challengedPic}
                                    id="userPhoto" alt={state.challenged} />
                            </div>
                            <div>
                                <h5>{state.challenged}</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
}

export default ChallengePage;