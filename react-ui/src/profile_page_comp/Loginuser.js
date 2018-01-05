/**
 * The Login Page for the user 
 */
import React, { Component } from 'react';

var firebase = require('firebase');
require('./login.css');
require('firebase/firestore');
var db = firebase.firestore();


class Loginuser extends Component {
    constructor(props) {
        super(props);
        this.loginWithProviders = this.loginWithProviders.bind(this);
        this.checkEmail = this.checkEmail.bind(this);
        this.loginWithEmail = this.loginWithEmail.bind(this);
    }

    /**
     * Login with either Facebook or Google
     * @param {string} client 
     */
    loginWithProviders(client) {
        var provider;
        if (client === 'google') {
            provider = new firebase.auth.GoogleAuthProvider();
            //sign in with redirect
            firebase.auth().signInWithRedirect(provider);
            //With successful signin, it leads to the ProfileCheck.js page. 
            /* --> This should be where the page goes after the user signs in successfully. s
             //get the redirect result
            firebase.auth().getRedirectResult().then(function (result) {
                if (result.credential) {
                    var token = result.credential.accessToken;
                    console.log("Token: " + token);
                }
                //the signed-in user
                var user = result.user;
                console.log("User: " + user);
            });
            */

        } else if (client === 'facebook') {
            //person wants to log in with facebook. 
            provider = new firebase.auth.FacebookAuthProvider();
            firebase.auth().signInWithRedirect(provider);
        } else if (client === 'email') {
            //person wants to login/Signup with the Email
            document.getElementById('emailLogin').style.display = 'none';
        }
    }

    /**
     * Check if the email already exists in the database. 
     */
    checkEmail() {
        //get the data entered. 
        const email_input = document.getElementById('email_input').value;
        const password_input = document.getElementById('password_input').value;
        //check if the user already has an account with this email address. 
        const userRef = db.collection('users').doc(email_input);
        userRef.get().then(function (doc) {
            if (doc && doc.exists) {
                //User already exists so lead them to their profile page. 
                firebase.auth().signInWithEmailAndPassword(email_input, password_input).catch(function (error) {
                    //Error signing in user. 
                    document.getElementById('email_sign_in_button').textContent = "Could not sign in";
                    //clear out the password field. 
                    document.getElementById('password_input').value = "";
                });
            } else {
                //No user exists so ask them if they want to sign up?
                document.getElementById('user_detection').textContent = "No user with this email";
                document.getElementById('email_sign_in_button').style.display = 'none';
                document.getElementById('email_sign_up_button').style.display = '';
            }
        }).catch(function (error) {
            //Catch any errors that come up during the retrieval of emails 
            console.log("Got an error: " + error);
        })
    }

    /**
     * Login with the email and password method instead of either Google or Facebook. 
     */
    loginWithEmail() {
        //User wants to signup with email so sign him up
        const email_input = document.getElementById('email_input').value;
        const password_input = document.getElementById('password_input').value;
        const userRef = db.collection('users').doc(email_input);
        userRef.set({
            userEmail: email_input,
            password_input: password_input,
            first: 'true'
        }, { merge: true }).then(function () {
            console.log("Data Saved");
            //Sign up the user with the email and password. 
            firebase.auth().createUserWithEmailAndPassword(email_input, password_input).catch(function (error) {
                //there were errors in signing the user up. 
                document.getElementById('email_sign_in_button').textContent = "Could not sign up";
            });
        }).catch(function (err) {
            console.log("Error: " + err);
        });

    }

    render() {


        return (
            <div className="loginSection" >
                <div className="card loginCard" >
                    <div className="card-block">
                        <h4 className="card-title" style={{ color: 'red' }}><strong>ChallengeMe</strong></h4>
                        <hr id="hrLine" />
                        <p className="card-text web_description">
                            ChallengeMe is <strong>a place where people can showcase their skills and get challenged by others.</strong><br /> The goal is to have fun while improving yourself.
                    </p>
                    </div>
                </div>
                <hr id="hrLine" />
                <div className="card loginCard text-center" >
                    <div className="card-block">
                        <form className="form-signin">
                            <h2 className="card-title text-center">Login</h2>
                            <button className="btn btn-lg btn-outline-danger login_buttons"
                                type="button" id="googleLoginButton" onClick={() => this.loginWithProviders('google')}>
                                <i className="fab fa-google"></i> | Login with Google
                            </button>
                            <button className="btn btn-lg btn-outline-primary login_buttons"
                                type="button" id="facebookLoginButton" onClick={() => this.loginWithProviders('facebook')}>
                                <i className="fab fa-facebook-f"></i> | Login with Facebook
                            </button>
                            <div className="collapse" id="loginWithEmail" style={{ padding: '3px' }} >
                                <div className="form-group">
                                    <input type="email" className="form-control" id="email_input" placeholder="Enter email" required />
                                    <small id="user_detection" className="form-text text-muted"></small>
                                </div>
                                <div className="form-group">
                                    <input type="password" className="form-control" id="password_input" placeholder="Password" required />
                                </div>
                                <div className="form-group">
                                    <button type="button" id="email_sign_in_button" className="btn btn-lg btn-outline-success login_buttons"
                                        onClick={() => this.checkEmail()}>Sign In</button>
                                    <button type="button" id="email_sign_up_button" className="btn btn-lg btn-outline-success login_buttons"
                                        onClick={() => this.loginWithEmail()} style={{ display: 'none' }}>Sign Up</button>
                                </div>
                            </div>
                            <button className="btn btn-lg btn-outline-success login_buttons"
                                type="button" id="emailLogin" data-toggle="collapse" data-target="#loginWithEmail"
                                onClick={() => this.loginWithProviders('email')}>
                                <i className="far fa-envelope"></i> | Login with Email
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default Loginuser;