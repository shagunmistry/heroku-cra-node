/**
 * Leads to the Profile Page where the user can see profiles (their own if logged in)
 */

import React, { Component } from 'react';
import Loginuser from './Loginuser';
//import Profilecard from './Profilecard';
import Profilepage from './Profile_page';

import firebaseApp from '../firebase/Firebase';

class ProfileCheck extends Component {
    constructor(props) {
        super(props);
        this.state = {
            check: false,
            uid: ""
        };
    };

    componentWillMount() {
        var referThis = this;
        //Check if the user has already logged in, if so lead to their profile page. if not, set the check status to False.  
        firebaseApp.auth().onAuthStateChanged(function (user) {
            if (user) {
                //when the user has signed in, go to this page. 
                referThis.setState({
                    check: true,
                    uid: user.uid
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
        if (this.state.check) {
            return (
                //The user is logged in so return the profile page.
                <Profilepage uid={this.state.uid} customize={true} />
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