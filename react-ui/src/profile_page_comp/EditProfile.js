/**
 * Thi is the page where people can edit their profile .
 */

import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import firebaseApp from '../firebase/Firebase';
require('./edit_page.css');
var firebase = require('firebase');

//Picture storage. 
var defStorageRef = firebaseApp.storage().ref(), db = firebase.firestore();


class EditProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userUID: "",
            loggedIn: false,
            username: "",
            profilePic: "",
            userEmail: '',
            pictureFile: [],
        }
        this.changePic = this.changePic.bind(this);
        this.submitChanges = this.submitChanges.bind(this);
        this.cancelChanges = this.cancelChanges.bind(this);
    }

    componentWillMount() {
        var referThis = this;

        firebaseApp.auth().onAuthStateChanged(function (user) {
            if (user) {
                //set up their informaton. 
                /*referThis.setState({
                    userUID: user.uid,
                    loggedIn: true,
                    userEmail: user.email
                }); */
                const docRef = db.collection('users').doc(user.email);
                docRef.get().then(function (snap) {
                    if (snap && snap.exists) {
                        //the user already exists to get their data
                        referThis.setState({
                            username: snap.data().name,
                            userEmail: snap.data().userEmail,
                            profilePic: snap.data().profilePic,
                            userUID: user.uid
                        });

                        //change the values of the input boxes
                        document.getElementById('aboutInput').innerText = snap.data().about || "";
                        document.getElementById('taglineInput').value = snap.data().tagline || "";
                        document.getElementById('facebookLinkInput').value = snap.data().facebook || "";
                        document.getElementById('linkedInLinkInput').value = snap.data().linkedin || "";
                        document.getElementById('twitterLinkInput').value = snap.data().twitter || "";
                        document.getElementById('usernameInput').value = snap.data().username || "";
                    }
                }).catch(function (err) {
                    //Error getting user's data
                    window.alert('Error: ' + err);
                })
            } else {
                //user is not logged in so send them to the login page 
                window.location.replace('/check_user_status');
            }
        });
    }


    changePic(acceptedFiles, rejectedFiles) {
        var referThis = this;
        if (rejectedFiles === undefined && acceptedFiles[0] === undefined) {
            //This means there were no eligible files uploaded/chosen
            document.getElementById('cardHeader').innerText = "Please choose a valid file";
        } else {
            //get the state to store the picture file. 
            var pictureFile = this.state.pictureFile;
            pictureFile.push(acceptedFiles[0]);
            this.setState({ pictureFile });

            //get the reference to the storage area 
            var imageRef = defStorageRef.child('users/' + referThis.state.userUID + '/images/' + this.state.pictureFile[0].name);
            //now upload the file to the storage. 
            var uploadTask = imageRef.put(this.state.pictureFile[0]);
            uploadTask.on('state_changed', function (snapshot) {
                //var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                switch (snapshot.state) {
                    case firebase.storage.TaskState.PAUSED: // or 'paused'
                        break;
                    case firebase.storage.TaskState.RUNNING: // or 'running'
                        break;
                    default:
                        document.getElementById('dropZone_txt').innerText = 'Uploading Picture';
                }
            }, function (error) {
                document.getElementById('cardHeader').innerText = 'Upload Unsuccessfull. Please try again later!';
            }, function () {
                //successful upload
                let picUrl = uploadTask.snapshot.downloadURL;
                //set the firebase node to the download url for profilePic
                db.collection('users').doc(referThis.state.userEmail).set({
                    profilePic: picUrl
                }, { merge: true }).catch(function (error) {
                    //Error setting the database profile pic url
                    document.getElementById('cardHeader').innerText = 'Database-Upload Unsuccessfull. Please try again later!';
                }).then(function (success) {
                    let pictureFile = referThis.state.pictureFile;
                    pictureFile.length = 0;
                    referThis.setState({
                        pictureFile
                    });
                });
            });

        }
    }

    /**
     * Submit the changes made
     */
    submitChanges() {
        //get all the values from the fields. 
        const facebook = document.getElementById('facebookLinkInput').textContent, linkedin = document.getElementById('linkedInLinkInput').textContent,
            twitter = document.getElementById('twitterLinkInput').textContent, about = document.getElementById('aboutInput').value,
            tagline = document.getElementById('taglineInput').value, name = document.getElementById('usernameInput').value;

        if (name === "" || about === "") {
            document.getElementById('warningLabel').innerText = "Please fill in the required information!";
        } else {
            const docRef = db.collection('users').doc(this.state.userEmail);
            docRef.set({
                tagline: tagline,
                username: name,
                about: about,
                facebook: facebook,
                twitter: twitter,
                linkedin: linkedin,
            }, { merge: true }).catch(function (err) {
                //Error submitting the new values, so alert them and let them know
                document.getElementById('cardHeader').innerText = "Error saving your Information";
            }).then(function () {
                //successful save so lead them to the profile page. 
                document.getElementById('cardHeader').innerText = "Successful save";
                window.location.replace('/check_user_status');
            })
        }

    }

    /**
     * Cancel all the changes
     */
    cancelChanges() {

    }
    render() {
        return (
            <div className="container">
                <div className="card editAboutCard" id="edit_card">
                    <div className="card-header" id="cardHeader" style={{ color: 'red' }}>Edit Profile</div>
                    <div className="card-block" id="editCardBlock">
                        <div className="row">
                            <div className="col-md-6">
                                <strong><h3 id="username">{this.state.username}</h3></strong>
                                <img alt="ProfilePic" src={this.state.profilePic} id="profile_picture" />
                            </div>
                            <div className="col-md-6">
                                <Dropzone id="picUploadZone" type="file" onDrop={(files) => this.changePic(files)} accept="image/*" multiple={false}>
                                    <div id="dropZone_txt">Upload New Picture</div>
                                </Dropzone>
                            </div>
                        </div>
                        <form id="input_form">
                            <div className="form-group">
                                <label>Name</label>
                                <input type="text" id="usernameInput" className="form-control" placeholder="What is your name?" required="true" />
                            </div>
                            <div className="form-group">
                                <label>About</label>
                                <textarea id="aboutInput" className="form-control" type="text" placeholder="Say something about yourself and your content" rows="3"
                                    required="true" />
                            </div>
                            <div className="form-group">
                                <label>Tagline</label>
                                <textarea id="taglineInput" className="form-control" type="text" placeholder="{City, } State, Country" rows="1"
                                    required="true" />
                            </div>
                            <div className="form-group">
                                <label id="facebookInput">Facebook Link</label>
                                <input type="url" className="form-control" id="facebookLinkInput" placeholder="https://www.facebook.com/username" />
                                <label id="linkedinInput">LinkedIn Link</label>
                                <input type="url" className="form-control" id="linkedInLinkInput" placeholder="https://www.linkedin.com/username" />
                                <label id="twitterInput">Twitter Link</label>
                                <input type="url" className="form-control" id="twitterLinkInput" placeholder="https://www.twitter.com/username" />
                            </div>
                            <div className="form-group">
                                <button type="button" className="btn btn-danger btn-4" id="saveButton" onClick={() => this.submitChanges()}>Save Changes</button>
                                <button type="button" className="btn btn-link" id="cancelButton" onClick={() => this.cancelChanges()}>Cancel</button>
                                <small id="warningLabel"></small>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default EditProfile;