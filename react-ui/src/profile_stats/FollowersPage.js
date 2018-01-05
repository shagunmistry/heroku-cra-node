/**
 * The page where the user can see their followers. 
 * User's Profile card at the top of the profile page
    profile_numbers - listOfNicknames -> profileNickname -> followers -> list of followers
                                                         -> challengers -> list of challengers */

import React, { Component } from 'react';
import firebaseApp from '../firebase/Firebase';
require('./followers_page.css');

var firebase = require('firebase');
var db = firebase.firestore();

class FollowersPage extends Component {


    componentWillMount() {
        //get the nickname  and email first
        firebaseApp.auth().onAuthStateChanged(function (user) {
            if (user) {
                db.collection('users').doc(user.email).get().then(function (snap) {
                    if (snap && snap.exists) {
                        const followerRef = db.collection('profile_numbers').doc('listOfNicknames')
                            .collection(snap.data().nickname).doc('followers');
                        followerRef.get().then(function (lists) {
                            if (lists && lists.exists) {

                            } else {
                                //No followers here
                                document.getElementById('card_header').innerText = 'No Followers yet :( ';
                            }
                        })
                    } else {
                        //User has to complete editing their profile. 
                        window.location.replace('/check_user_status');
                    }
                });
            } else {
                window.location.replace('/check_user_status');
            }
        });



    }
    render() {
        return (
            <div className="container">
                <div className="card followersCard">
                    <div className="card-header" id="card_header">Followers</div>
                    <div className="card-block">
                    </div>
                </div>
            </div>
        );
    }
}

export default FollowersPage;