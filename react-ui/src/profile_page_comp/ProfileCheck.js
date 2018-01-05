/**
 * Leads to the Profile Page where the user can see profiles (their own if logged in)
 */

import React, { Component } from 'react';
import Loginuser from './Loginuser';
import CreateNickname from './CreateNickname';

import firebaseApp from '../firebase/Firebase';

var firebase = require('firebase');
var db = firebase.firestore();

class ProfileCheck extends Component {
    constructor(props) {
        super(props);
        this.state = {
            check: false,
            uid: "",
            first: false,
            email: ''
        };
    };

    componentWillMount() {
        var referThis = this;
        //Check if the user has already logged in, if so lead to their profile page. if not, set the check status to False.  
        firebaseApp.auth().onAuthStateChanged(function (user) {
            if (user) {
                /**
                 * Check if the user has "first == true" in their document, 
                 * if yes, then create nickname. If not, then check if their password field exists and if first === false 
                 * (for provider authentication)
                 */
                const userRef = db.collection('users').doc(user.email);
                userRef.get().then(function (doc) {
                    if (doc && doc.exists) {
                        //check if the password field is empty
                        if (doc.data().password_input === undefined && doc.data().first === undefined) {
                            //user has not created a username yet so ask them to. 
                            referThis.setState({
                                first: true,
                                uid: user.uid,
                                email: user.email
                            });
                        } else if (doc.data().first === 'true') {
                            //it is user's first time signin in, so ask them to create a nickname
                            referThis.setState({
                                first: true,
                                uid: user.uid,
                                email: user.email
                            });
                        } else if (doc.data().first === 'false') {
                            //when the user has signed in, go to this page. 
                            window.location.replace('/users/' + doc.data().nickname);
                        }
                    } else {
                        //This would be true for the provider logins 
                        userRef.set({
                            userEmail: user.email,
                            first: 'true'
                        }, { merge: true }).then(function () {
                            referThis.setState({
                                first: true,
                                uid: user.uid,
                                email: user.email
                            });
                        });
                        console.log('Doc does not exist');
                    }
                });
            } else {
                referThis.setState({
                    check: false
                });
            }
        }, function (error) {
            //Add a function where if there was an error, send an email to me 
            window.alert("There was an error: " + error.code + "\n Please try again later");
            console.log("Error Message: " + error.message);
        });
    }

    render() {
        if (this.state.first) {
            //User needs to create a username so ask them to go set it up. 
            return (
                <CreateNickname uid={this.state.uid} email={this.state.email} />
            );
        } else {
            //The user is not logged in so return the Login page
            return (
                <Loginuser />
            );
        }
    }
}
export default ProfileCheck;