/****
 * Challenges Page where all the trending challenges will be displayed. 
 */

import React, { Component } from 'react';
//import ChallengeCard from './ChallengeCard';
//import firebaseApp from '../firebase/Firebase';
import ChallengeCard from './ChallengeCard'
import './challenge_page.css';
require('firebase/firestore');
var firebase = require('firebase');
var db = firebase.firestore();

//var databaseRef = firebaseApp.database();
var userInfo = {};
var userArray = [];

class OngoingChallenges extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrayOfChallengeData: []
        }
        this.componentWillMount = this.componentWillMount.bind(this);
    }

    //Load all the challenges from the Challenges Node in Database
    /**
     * Method: 
     * 1. Get the Challenged Video's Unique Key, which will be the first key
     * 2. Get the value under challengerUniqueKey
     * 3. Get the challengerHits and challengedHits 
     * 4. go under POSTS/ to find the video information using those Unique Keys
     * 5. Store all this in an object (just Whatever you need, not every single thing probably);
     */
    componentWillMount() {
        //Get the data
        //var referThis = this;
        let videoRef = db.collection('challenges'), referThis = this;

        videoRef.get().then(function (snap) {
            snap.forEach(function (eachVideo) {
                //This is all the information we need for this page. When we actually pull up the challenge,
                //we can use the nickname + videoTitle to pull up the videos. 
                userInfo = {};

                userInfo.challenged = eachVideo.data().challenged;
                userInfo.challenger = eachVideo.data().challenger;
                userInfo.challengeID = eachVideo.id;
                userInfo.challengedVideoTitle = eachVideo.data().challengedVideoTitle;
                userInfo.challengerVideoTitle = eachVideo.data().challengerVideoTitle;
                userInfo.challengerVotes = eachVideo.data().challengerVotes;
                userInfo.challengedVotes = eachVideo.data().challengedVotes;

                userArray.push(userInfo);
                userInfo = {};
            });

        }).then(function () {
            //On Success
            referThis.setState({
                arrayOfChallengeData: userArray
            });
            userArray = [];
        });
    }

    render() {

        var arrayToPass = this.state.arrayOfChallengeData;
        return (
            <div>
                {
                    arrayToPass.map((data, i) => <ChallengeCard {...data} key={data.challengeID + i} />)
                    /*  < ChallengeCard />
                      <ChallengeCard />
                      <ChallengeCard />
                      <ChallengeCard /> */
                }


            </div>
        )

    }

}


export default OngoingChallenges;
