/** 
 * Path: stats -> email -> videoTitle (modified) -> socialNumbers --> like, dislike, challenge 
 */
import React, { Component } from 'react';
import firebaseApp from '../firebase/Firebase';
import Dropzone from 'react-dropzone';
import { Player } from 'video-react';
import './buttons.css';

require('firebase/firestore');
var firebase = require('firebase');
var db = firebase.firestore();

var storageRef = firebaseApp.storage().ref(), databaseRef = firebaseApp.database();



var Modal = require('boron/ScaleModal');
var modalStyle = {
    width: 'auto',
}


class SocialButtonComponent extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            likes: 0,
            dislikes: 0,
            challenges: 0,
            filesToBeSent: [],
            likedBefore: false,
            dislikedBefore: false,
            temp_video: ''
        });
        this.likeButton = this.likeButton.bind(this);
        this.dislikeButton = this.dislikeButton.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);

        //Methods needed to Upload a Challenge Video
        this.challengeButton = this.challengeButton.bind(this);
        this.showModal = this.showModal.bind(this); this.closeModal = this.closeModal.bind(this);
        this.emptyArray = this.emptyArray.bind(this);
        this.submitChallenge = this.submitChallenge.bind(this);
        this.randomString = this.randomString.bind(this);
        this.onDrop = this.onDrop.bind(this);
    }

    componentDidMount() {
        var key = this.props.uniqueKey, referThis = this;

        //Go to the database under STATS/ and use the key to get all the information. 
        const getStatsRef = db.collection('all_videos').doc(this.props.videoID);
        getStatsRef.onSnapshot(function (doc) {
            if (doc && doc.exists) {
                referThis.setState({
                    likes: doc.data().likes,
                    dislikes: doc.data().dislikes,
                    challenges: doc.data().challenges,
                });
            }
        });

        //See if there is an active user, then color the social support buttons, Else.DONT!
        firebaseApp.auth().onAuthStateChanged(function (user) {
            if (user) {
                var dislikeBtnID = document.getElementById(referThis.props.activeUserID + referThis.props.eachKey + 'dislike');
                var likeBtn = document.getElementById(referThis.props.activeUserID + referThis.props.eachKey + 'like');
                //ID of the buttons = userid+activeNickname        
                //Find out if the user has liked/disliked it before and then change the color
                const activeStatRef = db.collection('stats').doc(user.email).collection(referThis.props.videoID).doc('socialNumbers');
                activeStatRef.onSnapshot(function (snapshot) {
                    if (snapshot && snapshot.exists) {
                        if (snapshot.data().like) {
                            likeBtn.style.backgroundColor = "white";
                            likeBtn.style.color = "red";
                            likeBtn.style.border = "none";
                        } else {
                            likeBtn.style.backgroundColor = "transparent";
                            likeBtn.style.color = "black";
                        }
                        if (snapshot.data().dislike) {
                            //if the user has disliked the video then do the same
                            dislikeBtnID.style.backgroundColor = "white";
                            dislikeBtnID.style.color = "red";
                            dislikeBtnID.style.border = "none";
                        } else {
                            dislikeBtnID.style.backgroundColor = "transparent";
                            dislikeBtnID.style.color = "black";
                        }
                    }
                });
            }
        });
    }

    /**
     * - Like the video based on whether or not they have liked it before or disliked it before. 
     */
    likeButton() {
        var originalLikes = this.state.likes, originalDislikes = this.state.dislikes, referThis = this;
        //User has logged in.
        if (this.props.activeUser) {
            //Make the boolean true
            //Decide if the user already liked or not before. 
            const activeStatRef = db.collection('stats').doc(this.props.activeUserEmail)
                .collection(referThis.props.videoID).doc('socialNumbers');

            activeStatRef.get().then(function (snapshot) {
                if (snapshot && snapshot.exists) {
                    if (snapshot.data().dislike) {
                        //User has disliekd the video before so decrement that counter 
                        referThis.setState({
                            dislikedBefore: true
                        });
                    }
                    if (snapshot.data().like) {
                        //User already likes it so decrement the counter
                        //decrement the counter first under videos and then under all_videos 
                        let all_videosRef = db.collection('all_videos').doc(referThis.props.videoID);
                        all_videosRef.set({
                            likes: originalLikes - 1
                        }, { merge: true }).then(function () {
                            let videos_ref = db.collection('videos').doc(referThis.props.uploaderNickname)
                                .collection(referThis.props.videoID).doc('video_info');
                            videos_ref.set({
                                likes: originalLikes - 1
                            }, { merge: true });
                        });

                        //Set the boolean to false. 
                        activeStatRef.set({
                            like: false,
                        }, { merge: true });

                    } else {
                        //user has not liked it before so increment the counter 
                        let all_videosRef = db.collection('all_videos').doc(referThis.props.videoID);
                        if (referThis.state.dislikedBefore) {
                            originalDislikes -= 1;
                        }

                        all_videosRef.set({
                            likes: originalLikes + 1,
                            dislikes: originalDislikes
                        }, { merge: true }).then(function () {
                            let videos_ref = db.collection('videos').doc(referThis.props.uploaderNickname)
                                .collection(referThis.props.videoID).doc('video_info');
                            videos_ref.set({
                                likes: originalLikes + 1,
                                dislikes: originalDislikes
                            }, { merge: true });
                        });
                        //Set the boolean to false. 
                        activeStatRef.set({
                            like: true,
                            dislike: false
                        }, { merge: true });
                    }
                } else {
                    //user has never liked it before
                    let all_videosRef = db.collection('all_videos').doc(referThis.props.videoID);
                    //the user has liked it pre
                    if (referThis.state.dislikedBefore) {
                        originalDislikes -= 1;
                    }

                    all_videosRef.set({
                        likes: originalLikes + 1,
                        dislikes: originalDislikes
                    }, { merge: true }).then(function () {
                        let videos_ref = db.collection('videos').doc(referThis.props.uploaderNickname)
                            .collection(referThis.props.videoID).doc('video_info');
                        videos_ref.set({
                            likes: originalLikes + 1,
                            dislikes: originalDislikes
                        }, { merge: true });
                    });

                    //Set the boolean to false. 
                    activeStatRef.set({
                        like: true,
                        dislike: false
                    }, { merge: true });
                }
            });
        } else {
            //If the User has not logged in, then alert them and let them know. 
            this.refs.denyModal.show();;
        }
    }

    /**
     * Dislike the video based on whether or not they have liked it before or disliked it before. 
     */
    dislikeButton() {
        var originalDislikes = this.state.dislikes, referThis = this, originalLikes = this.state.likes;
        //User has logged in.
        if (this.props.activeUser) {
            const activeStatRef = db.collection('stats').doc(this.props.activeUserEmail)
                .collection(referThis.props.videoID).doc('socialNumbers');

            activeStatRef.get().then(function (snapshot) {
                if (snapshot && snapshot.exists) {

                    if (snapshot.data().like) {
                        //User has liked the video before so decrement that counter 
                        referThis.setState({
                            likedBefore: true
                        });
                    }
                    if (snapshot.data().dislike) {
                        //User already dislikes it so decrement the counter
                        //decrement the counter first under videos and then under all_videos 
                        let all_videosRef = db.collection('all_videos').doc(referThis.props.videoID);
                        all_videosRef.set({
                            dislikes: originalDislikes - 1
                        }, { merge: true }).then(function () {
                            let videos_ref = db.collection('videos').doc(referThis.props.uploaderNickname)
                                .collection(referThis.props.videoID).doc('video_info');
                            videos_ref.set({
                                dislikes: originalDislikes - 1
                            }, { merge: true });
                        });

                        //Set the boolean to false. 
                        activeStatRef.set({
                            dislike: false,
                        }, { merge: true });

                    } else {
                        //user has not liked it before so increment the counter 
                        let all_videosRef = db.collection('all_videos').doc(referThis.props.videoID);
                        all_videosRef.set({
                            dislikes: originalDislikes + 1,
                            likes: referThis.state.likedBefore ? originalLikes - 1 : originalLikes
                        }, { merge: true }).then(function () {
                            let videos_ref = db.collection('videos').doc(referThis.props.uploaderNickname)
                                .collection(referThis.props.videoID).doc('video_info');
                            videos_ref.set({
                                dislikes: originalDislikes + 1,
                                likes: referThis.state.likedBefore ? originalLikes - 1 : originalLikes
                            }, { merge: true });
                        });
                        //Set the boolean to false. 
                        activeStatRef.set({
                            like: false,
                            dislike: true
                        }, { merge: true });
                    }
                } else {
                    //user has never liked it before
                    let all_videosRef = db.collection('all_videos').doc(referThis.props.videoID);
                    all_videosRef.set({
                        dislikes: originalDislikes + 1,
                        likes: referThis.state.likedBefore ? originalLikes - 1 : originalLikes
                    }, { merge: true }).then(function () {
                        let videos_ref = db.collection('videos').doc(referThis.props.uploaderNickname)
                            .collection(referThis.props.videoID).doc('video_info');
                        videos_ref.set({
                            dislikes: originalDislikes + 1,
                            likes: referThis.state.likedBefore ? originalLikes - 1 : originalLikes
                        }, { merge: true });
                    });

                    //Set the boolean to false. 
                    activeStatRef.set({
                        like: false,
                        dislike: true
                    }, { merge: true });
                }
            });
        } else {
            //If the User has not logged in, then alert them and let them know. 
            this.refs.denyModal.show();
        }

    }

    //Show Modal
    showModal() {
        if (this.props.activeUser) {
            this.refs.modal.show();
        } else {
            this.refs.denyModal.show();
        }
    }
    //Close Modal
    closeModal() {
        this.refs.modal.hide();
    }


    /**
     * When the user wants to challenge the Posted video, Pop up a modal to ask them to confirm
     * and then go to the video upload page and ask them to upload the challenging video..
     * Also, pass in something to Upload video page so that it looks different if its an upload. 
     */
    challengeButton() {
        var referThis = this, challengerUserID = referThis.props.activeUserID;

        //Check if they are logged in and that the user does not challenge his own video
        if (referThis.props.activeUser) {

        } else {
            this.refs.denyModal.show();
        }
    }

    /**
    * Empty out the array used for storage 
    */
    emptyArray() {
        //Empty out the array after submission.
        var filesToBeSent = this.state.filesToBeSent;
        filesToBeSent.length = 0;
        this.setState({ filesToBeSent });
        console.log("Files Array: " + this.state.filesToBeSent);
    }

    /**
    * Create a random string of 5 characters to place at the end of database path.
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
    * When the user submits the challenge, 
     - Increment the challenge counter at all_videos and videos node
     - Increment counter on their profile. 
     - Upload the video under challenges --> 
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

    /**
    * ONDROP() - checks whether or not the chosen file is acceptable and then uploads it to Firebase Storage. 
    * @param {*} acceptedFiles 
    * @param {*} rejectedFiles 
    */
    onDrop(acceptedFiles, rejectedFiles) {
        let referThis = this;

        if (rejectedFiles === undefined && acceptedFiles[0] === undefined) {
            window.alert("Please choose a valid video file!");
            window.location.replace('/UploadVideo');
        } else {
            document.getElementById('demo_div').style.display = 'block';

            //Upload the file to the Temp storage 
            var temp_ref = storageRef.child('users/' + this.state.activeNickname + '/temp_video/temp_video_file');
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

    render() {
        if (this.props.buttonType === "like") {
            return (
                <div>
                    <a id={this.props.activeUserID + this.props.eachKey + 'like'} className="supportButtons" onClick={() => this.likeButton()} role="button">
                        <i className="far fa-thumbs-up" id="button_icon"></i></a>
                    <p>{this.state.likes}</p>
                    <Modal ref="denyModal" modalStyle={{ width: 'auto' }}>
                        <div className="card">
                            <h3 className="card-header">Please log in to like</h3>
                            <a className="card-text" style={{ color: 'blue', textAlign: 'center' }} href="/ProfileCheck"><h4>Login Here</h4></a>
                        </div>
                    </Modal>
                </div>
            )
        } else if (this.props.buttonType === "challenge") {
            return (
                <div>
                    <a id={this.props.activeUserID + this.props.eachKey + 'challenge'} className="supportButtons" onClick={() => this.showModal()} role="button">
                        <i className="fab fa-connectdevelop" id="button_icon"></i></a>
                    <p>{this.state.challenges}</p>
                    <Modal ref="denyModal" modalStyle={{ width: 'auto' }}>
                        <div className="card">
                            <h3 className="card-header">Please log in to challenge</h3>
                            <a className="card-text" style={{ color: 'blue', textAlign: 'center' }} href="/ProfileCheck"><h4>Login Here</h4></a>
                        </div>
                    </Modal>
                    <Modal ref="modal" modalStyle={modalStyle}>
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
                                    onClick={() => this.submitChallenge()} > Upload Challenge Video</button>
                            </div>
                        </div>
                    </Modal>
                </div>
            );
        } else if (this.props.buttonType === "dislike") {
            return (
                <div>
                    <a id={this.props.activeUserID + this.props.eachKey + 'dislike'}
                        className="supportButtons" onClick={() => this.dislikeButton()} role="button">
                        <i className="far fa-thumbs-down" id="button_icon"></i></a>
                    <p>{this.state.dislikes}</p>
                    <Modal ref="denyModal" modalStyle={{ width: 'auto' }}>
                        <div className="card">
                            <h3 className="card-header">Please log in to dislike</h3>
                            <a className="card-text" style={{ color: 'blue', textAlign: 'center' }} href="/ProfileCheck"><h4>Login Here</h4></a>
                        </div>
                    </Modal>
                </div>
            );
        }
    }
}

export default SocialButtonComponent;