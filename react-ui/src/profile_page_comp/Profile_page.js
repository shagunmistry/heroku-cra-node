/**
 * Show the user's profile page
 * depending on whether or not the person is a user. 
 * ID and visitor tag will be passed in as props 
 * ID will either be in link or PROPS. 
 * 
 */

import React, { Component } from 'react';
import Profilecard from './Profilecard';
import firebaseApp from '../firebase/Firebase';
import CardContainer from '../cards/CardContainer';
require('firebase/firestore');
var firebase = require('firebase');

//const database = firebaseApp.database();
var db = firebase.firestore();

class Profilepage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visitorBoolean: true,
            visitorNickname: '',
            profileNickname: ''
        }
    }

    componentDidMount() {
        var referThis = this;
        let profileNickname = this.props.match.params.nickname || '';

        firebaseApp.auth().onAuthStateChanged(function (user) {
            //If the user is logged in, see if the prop id matches that.
            if (user) {
                const userRef = db.collection('users').doc(user.email);
                userRef.get().then(function (doc) {
                    if (doc && doc.exists) {
                        //Compare the nickname to the active user's nickname 

                        if (doc.data().nickname === profileNickname) {
                            //Not a visitor 
                            referThis.setState({
                                visitorBoolean: false,
                                profileNickname: doc.data().nickname
                            });
                        } else {
                            //Is a visitor
                            referThis.setState({
                                profileNickname: profileNickname,
                                visitorBoolean: true,
                                visitorNickname: doc.data().nickname
                            });
                        }
                    } else {
                        //User has not been registered correctly so send them to the editProfile page.
                        window.alert("Please update your profile first");
                        window.location.replace('/EditProfile');
                    }
                });


            } else {
                //there is no user logged in so visitor tag is automatically true. 
                referThis.setState({
                    visitorBoolean: true, visitorNickname: ""
                });
            }
        });
    }

    render() {

        if (this.state.visitorBoolean) {
            if (this.state.visitorNickname === '') {
                return (
                    <div className="container">
                        <p id="loading_icon">| |</p>
                    </div>
                );
            }
        }
        return (
            <div>
                <Profilecard profileNickname={this.state.profileNickname}
                    visitorBoolean={this.state.visitorBoolean} visitorNickname={this.state.visitorNickname} />
                <CardContainer customize={true} profileNickname={this.state.profileNickname}
                    visitorBoolean={this.state.visitorBoolean} visitorNickname={this.state.visitorNickname}
                />
            </div>
        );
    }
}

export default Profilepage;