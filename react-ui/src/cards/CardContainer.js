/**
 * This is the place where it will pull up all the videos from the Firebase Database and
 * it will look like the Instagram time-line. 
 * 
 * Prop: CUSTOMIZE is for when you are calling this page to display either a specific user's profile page or specific category. 
 */
import React, { Component } from 'react';
import SingleCardContainer from './SingleCardContainer';
require('firebase/firestore');
var firebase = require('firebase');

var userInfo = {}, userArray = [];

var db = firebase.firestore();

class CardContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usedArray: [],
        }
        this.uniqueKeyCreator = this.uniqueKeyCreator.bind(this);
    }

    /**Create a unique key for each card to distinguish between each one  */
    uniqueKeyCreator() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 5; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }
    componentWillMount() {
        var referThis = this;
        //console.log(this.props);

        //Only for homepage 
        if (!this.props.customize) {
            //Go to the collection
            const videoRef = db.collection('all_videos').orderBy("likes", "desc");
            videoRef.get().then(function (querySnap) {
                querySnap.forEach(function (eachVideo) {
                    userInfo.videoURL = eachVideo.data().videoURL;
                    userInfo.videoDesc = eachVideo.data().videoDesc;
                    userInfo.videoTitle = eachVideo.data().title;
                    userInfo.likes = eachVideo.data().likes;
                    userInfo.dislikes = eachVideo.data().dislikes;
                    userInfo.challenges = eachVideo.data().challenges;
                    userInfo.nickname = eachVideo.data().nickname;
                    userInfo.tagged = eachVideo.data().tagged;
                    userInfo.email = eachVideo.data().email;
                    userInfo.videoID = eachVideo.id;
                    userInfo.eachKey = referThis.uniqueKeyCreator();
                    //Then push the object into an array.
                    userArray.push(userInfo);
                    //reset the userInfo object (just in case);
                    userInfo = {};
                });
                referThis.setState({
                    usedArray: userArray
                });
            });

        } else if (this.props.visitorBoolean || !this.props.visitorBoolean) {
            console.log(this.props.visitorNickname + " is visiting " + this.props.profileNickname + "'s profile!");
            //Get the user's nickname 
            let profileNickname = this.props.profileNickname;
            const videoRef = db.collection('all_videos').where('nickname', '==', profileNickname);
            videoRef.get().then(function (querySnap) {
                querySnap.forEach(function (doc) {
                    if (doc && doc.exists) {
                        userInfo.videoURL = doc.data().videoURL;
                        userInfo.videoDesc = doc.data().videoDesc;
                        userInfo.videoTitle = doc.data().title;
                        userInfo.likes = doc.data().likes;
                        userInfo.dislikes = doc.data().dislikes;
                        userInfo.challenges = doc.data().challenges;
                        userInfo.nickname = doc.data().nickname;
                        userInfo.tagged = doc.data().tagged;
                        userInfo.email = doc.data().email;
                        userInfo.videoID = doc.id;
                        userInfo.eachKey = referThis.uniqueKeyCreator();
                        //Then push the object into an array.
                        userArray.push(userInfo);
                        //reset the userInfo object (just in case);
                        userInfo = {};
                        referThis.setState({
                            usedArray: userArray
                        });
                    }
                });
            }).catch(function (error) {
                console.log('Error getting vides for this this user: ' + error);
            });
        }
    }

    render() {
        function initApp() {

        }
        window.addEventListener('load', function () {
            initApp();
        });

        var usedArray = this.state.usedArray;

        return (
            <div id="bodyType">
                {
                    usedArray.map((data, i) => <SingleCardContainer {...data} key={data.eachKey + i + i} />)
                }
            </div>
        );


    }

}


export default CardContainer;

  /* var videosRef = dataRef.ref('posts/');
             videosRef.on('value', function (snapshot) {
                 snapshot.forEach(function (data) {
                     //Store each value into an name-based object. 
                     userInfo.userid = data.val().userid;
                     userInfo.profilePic = data.val().profilePic;
                     userInfo.videoCategory = data.val().videoCategory;
                     userInfo.videoDesc = data.val().videoDesc;
                     userInfo.videoTitle = data.val().videoTitle;
                     userInfo.videoURL = data.val().videoURL;
                     userInfo.userName = data.val().userName;
                     userInfo.uniqueKey = data.key;
                     //Then push the object into an array.
                     userArray.push(userInfo);
                     //reset the userInfo object (just in case);
                     userInfo = {};
                     //console.log("Firebase function: " + userArray.length);
                 });
                 referThis.setState({
                     usedArray: userArray
                 });
                 // console.log(referThis.state.usedArray);
             }); */