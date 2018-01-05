/**
 * Let's users upload videos
 */
/**
   * Once the file is dropped, put it under TEMP storage node and then preview it. If they press cancel, make sure to delete it first. 
   */
import React, { Component } from 'react';
import firebaseApp from '../firebase/Firebase';
import Dropzone from 'react-dropzone';
import { Player } from 'video-react';

require('./upload_page.css');

var firebase = require('firebase'), storageRef = firebaseApp.storage().ref();
var db = firebase.firestore();

class UploadVideo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nickname: '',
            filesToBeSent: [],
            temp_video: '',
            email: ''
        }
        this.onDrop = this.onDrop.bind(this);
        this.submitChallenge = this.submitChallenge.bind(this);
        this.randomString = this.randomString.bind(this);
        this.emptyArray = this.emptyArray.bind(this);
    }

    /**
     * Check if the user is logged in 
     */
    componentWillMount() {
        var referThis = this;
        firebaseApp.auth().onAuthStateChanged(function (user) {
            if (user) {
                //user has signed in
                const userRef = db.collection('users').doc(user.email);
                userRef.get().then(function (doc) {
                    if (doc && doc.exists) {
                        //Check if a nickname has already been creatd
                        if (doc.data().nickname === undefined) {
                            window.location.replace('/check_user_status');
                        } else {
                            //get the user's nickname
                            referThis.setState({
                                nickname: doc.data().nickname,
                                email: user.email
                            });
                        }
                    }
                }).catch(function (error) {
                    console.log("Error: " + error);
                });
            } else {
                //User has not signed in . 
                window.alert("Please sign in");
                window.location.replace('/check_user_status');
            }
        })
    }

    /**
         * Empty out the state array used for storage 
         */
    emptyArray() {
        //Empty out the array after submission.
        var filesToBeSent = this.state.filesToBeSent;
        filesToBeSent.length = 0;
        this.setState({ filesToBeSent });
        console.log("Files Array: " + this.state.filesToBeSent);
    }


    /**
     * Check whether or not the file is acceptable, and thn drops it in the TEMP storage section. 
     */
    onDrop(acceptedFiles, rejectedFiles) {
        var referThis = this;
        if (rejectedFiles === undefined && acceptedFiles[0] === undefined) {
            document.getElementById('card_header').innerText = "Please choose a valid file!";
        } else {
            //console.log("Accepted File: " + acceptedFiles[0].type)
            //Create an Object URL from th Video. 
            //var objectURL = URL.createObjectURL(acceptedFiles[0]);
            document.getElementById('demo_div').style.display = 'block';
            // let videoPlayer = document.getElementById('demoPlayer');
            /* var filesToBeSent = this.state.filesToBeSent;
             filesToBeSent.push(acceptedFiles[0]);
             this.setState({ filesToBeSent }); */

            //Upload the file to the Temp storage 
            var temp_ref = storageRef.child('users/' + this.state.nickname + '/temp_video/temp_video_file');
            var uploadTask = temp_ref.put(acceptedFiles[0]);
            uploadTask.on('state_changed', function (snapshot) {
                //measure the progress of the upload. 
                switch (snapshot.state) {
                    case firebase.storage.TaskState.PAUSED:
                        console.log('Upload is PAUSED');
                        break;
                    case firebase.storage.TaskState.RUNNING:
                        //console.log('Upload is RUNNING');
                        document.getElementById('file_upload_status').innerText = "Uploading...: " + Math.ceil((snapshot.bytesTransferred / snapshot.totalBytes) * 100) + "%";
                        break;
                    default:
                        console.log('Uploading...');
                        break;
                }
            }, function (error) {
                //There was an error uploading the tempfile
                document.getElementById('upload_label').innerText = 'Error uploading File. Please try again later. ';
                referThis.emptyArray();
            }, function () {
                referThis.emptyArray();
                //Success uploading the temp file and get the download URL. and then delete the file. 
                const downloadURL = uploadTask.snapshot.downloadURL;
                //set the state to the temp video. 
                referThis.setState({
                    temp_video: downloadURL
                });
                temp_ref.delete().then(function () {
                    console.log('Temp Fil Deleted');
                });

                //Clear out the previous state and then push this file to it 
                var filesToBeSent = referThis.state.filesToBeSent;
                filesToBeSent.push(acceptedFiles[0]);
                referThis.setState({ filesToBeSent });

            });


        }
    }

    /**
     * Create a random string of letters to attach at the end of the video title for unique names
     */
    randomString() {
        var text = "";
        var rand = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < 5; i++) {
            text += rand.charAt(Math.floor(Math.random() * rand.length));
        }
        return text;
    }

    /**
     * Submit the video. 
     */
    submitChallenge() {
        var referThis = this, title = document.getElementById('titleInput').value,
            description = document.getElementById('descriptionInput').value;

        //Delet the temp    

        //get the unique nickname
        var random_title = title + '_' + this.randomString();

        //set up the Ref to STORAGE for the video that is to be uploaded
        var videoRef = storageRef.child('users/' + this.state.nickname + '/uploaded_video/' + random_title);
        var uploadTask = videoRef.put(this.state.filesToBeSent[0]);

        uploadTask.on('state_changed', function (snapshot) {
            //measure the progress of the upload. 
            switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED:
                    console.log('Upload is PAUSED');
                    break;
                case firebase.storage.TaskState.RUNNING:
                    //console.log('Upload is RUNNING');
                    document.getElementById('submitButton').innerText = "Uploading...: " + Math.ceil((snapshot.bytesTransferred / snapshot.totalBytes) * 100) + "%";
                    break;
                default:
                    console.log('Uploading...');
                    break;
            }
        }, function (error) {
            //There was an error uploading the file. 
            document.getElementById('submitButton').innerText = 'Error Uploading File. Please try again later. ';
            referThis.emptyArray();
        }, function () {
            //Success uploading file. 
            //Get the download url 
            const downloadURL = uploadTask.snapshot.downloadURL;
            //Submit the info to Firestore
            var video_doc_ref = db.collection('videos').doc(referThis.state.nickname).collection(random_title).doc('video_info');
            console.log('New Document ID: ' + video_doc_ref.id);
            video_doc_ref.set({
                title: title,
                videoURL: downloadURL,
                videoDesc: description,
                tagged: '',
                likes: 0,
                dislikes: 0,
                challenges: 0,
                nickname: referThis.state.nickname,
                email: referThis.state.email
            }, { merge: true }).then(function () {
                //This collection will be used to display all the videos on Homepage. 
                var all_vid_ref = db.collection('all_videos').doc(random_title);
                all_vid_ref.set({
                    title: title,
                    videoURL: downloadURL,
                    videoDesc: description,
                    tagged: '',
                    likes: 0,
                    dislikes: 0,
                    challenges: 0,
                    nickname: referThis.state.nickname,
                    email: referThis.state.email
                }, { merge: true }).then(function () {
                    //Success uploading the data
                    document.getElementById('submitButton').innerText = "Upload Success!";
                    window.location.replace('/check_user_status');
                });
            }).catch(function (error) {
                document.getElementById('submitButton').innerText = "Error uploading";
            });

            //submit to all videos node. 
        });

    }

    render() {
        return (
            <div className="card uploadCard">
                <h3 className="card-header text-center" id="card_header">Upload Video</h3>
                <div className="card-block">
                    <form>
                        <div className="form-group">
                            <input type="text" className="form-control" id="titleInput" placeholder="Title of the Video" required />
                        </div>
                        <div className="form-group">
                            <textarea rows="3" maxLength="200" type="text" className="form-control" id="descriptionInput"
                                placeholder="What is the Video about?..." required />
                        </div>
                        <div className="form-group">
                            <input type="text" className="form-control" id="tagUsers" placeholder="Tag anyone?...This feature is not added yet..."
                                disabled="true" />
                        </div>
                        <div className="form-group">
                            <label id="upload_label">Upload Video</label>
                            <Dropzone id="dropzoneVid" type="file" onDrop={(files) => this.onDrop(files)} accept="video/*" multiple={false} required>
                                <div>Click to Upload or Drag your video here</div>
                            </Dropzone>
                            <small id="fileHelp" className="form-text text-muted">Supported: All Video Formats </small>
                            <small id="file_upload_status" className="form-text text-muted"></small>
                            <div id="demo_div" style={{ display: 'none' }}>
                                <Player src={this.state.temp_video}></Player>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="card-footer text-center">
                    <button type="button" className="btn btn-lg btn-outline-danger" id="submitButton"
                        onClick={() => this.submitChallenge()} > Upload Video</button>
                </div>
            </div>
        );
    }
}

export default UploadVideo;