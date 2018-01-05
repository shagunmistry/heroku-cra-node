/**
*   User's Profile card at the top of the profile page
    profile_followers - listOfNicknames -> profileNickname -> visitorNickname -> follow: true or challenger: true
    --To check the following status
    profile_stats -> profileNickname -> followers -> followerName -> follow: true/false and challenge: true/false. 

    
*/
import React, { Component } from 'react';
import firebaseApp from '../firebase/Firebase';
require('./profile_page.css');

var firebase = require('firebase');
var db = firebase.firestore();

class Profilecard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            followCount: 0,
            challengesCount: 0,
            activeUser: false,
            readyToDisplay: ''
        };
        this.followButton = this.followButton.bind(this);
    }

    componentDidMount() {
        let referThis = this;
        //Get the profile's information. 
        const userRef = db.collection('nicknames').doc(this.props.profileNickname);
        // const checkFollowRef = db.collection('profile_stats').doc(this.props.profileNickname)
        //    .collection('followers').doc(this.props.visitorNickname);

        userRef.get().then(function (snap) {
            if (snap && snap.exists) {
                let profileInfoRef = db.collection('users').doc(snap.data().email);
                profileInfoRef.get().then(function (doc) {
                    if (doc && doc.exists) {
                        document.getElementById('user_name').innerText = doc.data().username;
                        document.getElementById('tagline').innerText = doc.data().tagline;
                        document.getElementById('about_section').innerText = doc.data().about;
                        document.getElementById('profile_pic').src = doc.data().profilePic;
                    } else {
                        document.getElementById('user_name').innerText = 'This user does not exist';
                    }
                })
            } else {
                document.getElementById('user_name').innerText = 'This user does not exist';
            }
        });

        firebaseApp.auth().onAuthStateChanged(function (user) {
            if (user) {
                referThis.setState({
                    activeUser: true
                });
                if (referThis.props.visitorBoolean) {
                    const checkFollowRef = db.collection('profile_stats').doc(referThis.props.profileNickname)
                        .collection('followers').doc(referThis.props.visitorNickname);
                    checkFollowRef.get().then(function (doc) {
                        if (doc && doc.exists) {
                            if (doc.data().follow) {
                                document.getElementById('follow_button').innerText = "Following";
                            } else {
                                document.getElementById('follow_button').innerText = "Follow";
                            }
                        } else {
                            document.getElementById('follow_button').innerText = "Follow";
                        }
                    });
                }
            } else {
                referThis.setState({
                    activeUser: false
                });
            }
        });
    }

    /**
     * Follow the user. 
     */
    followButton() {
        if (this.props.visitorBoolean && this.state.activeUser) {
            //The user is a visitor so either follow or unfollow based on the current status
            const checkFollowRef = db.collection('profile_stats').doc(this.props.profileNickname)
                .collection('followers').doc(this.props.visitorNickname);
            checkFollowRef.get().then(function (doc) {
                if (doc && doc.exists) {
                    //Check if the follow is true. - unfollow if true
                    if (doc.data().follow) {
                        checkFollowRef.set({
                            follow: false
                        }).then(function () {
                            document.getElementById('follow_button').innerText = "Follow";
                        });
                    } else {
                        //User has not followed anyone or this person before 
                        checkFollowRef.set({
                            follow: true
                        }, { merge: true }).then(function () {
                            //Once they follow them, change the text button to "following"
                            document.getElementById('follow_button').innerText = "Following";
                        });
                    }
                } else {
                    //User has not followed anyone or this person before 
                    checkFollowRef.set({
                        follow: true
                    }, { merge: true }).then(function () {
                        document.getElementById('follow_button').innerText = "Following";
                    });
                }
            });
        } else {
            //User wants to see his followers
            //Direct them over to the followers page. 
            window.location.replace('/stats');
        }
    }


    render() {
        return (
            <div className="card" id="profile_card">
                <div className="row">
                    <div className="col-sm-3 col-md-2">
                        <img id="profile_pic" alt="Can't load" />
                    </div>
                    <div className="col-sm-10 col-md-9 info_section">
                        <div className="row" id="test_row">
                            <div className="col-sm-12">
                                <h3 id="user_name"></h3>
                                <h6 id="tagline"></h6>
                            </div>
                        </div>
                        <div className="row" id="test_row">
                            <div className="col-sm-5 col-xs-4 col-md-3">
                                <button type="button" className="btn btn-outline-danger option_buttons" id="follow_button" title="Followers"
                                    onClick={() => this.followButton()}> Follow
                                    {/*<i className="fa fa-users"></i> */}
                                </button>
                            </div>
                            <div className="col-sm-5 col-xs-4 col-md-3">
                                <button type="button" className="btn btn-outline-danger option_buttons" id="challenges_count"
                                    title="Challenges">{/*<i className="fa fa-shield"></i> */}
                                    Challenge
                                </button>
                            </div>
                            <div className="col-sm-4 col-xs-4 col-md-3">
                                <button id="aboutMe" type="button" className="btn btn-success option_buttons"
                                    data-toggle="collapse" data-target="#about_section">About</button>
                            </div>
                        </div>
                        <div className="row" id="test_row">
                            <div className="col-sm-12 collapse" id="about_section"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Profilecard;