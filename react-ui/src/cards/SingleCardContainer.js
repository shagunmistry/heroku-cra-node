import React, { Component } from 'react';
import { Player } from 'video-react';
import { Link } from 'react-router-dom';
import firebaseApp from '../firebase/Firebase';
import SocialButtonComponent from '../buttons/SocialButtonComponent';
import './cards.css';
import '../../node_modules/video-react/dist/video-react.css';
require('firebase/firestore');

var firebase = require('firebase');
var db = firebase.firestore();

class SingleCardContainer extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            activeUser: false,
            activeUserID: "",
            like: false,
            dislike: false,
            challenge: false,
            activeProfilePic: "",
            activeUserName: "",
            activeUserEmail: "",
            activeNickname: "",
            profilePicURL: "",
            commentsPage: this.props.commentsPage ? 'none' : 'block'
        });

        this.loadProfilePic = this.loadProfilePic.bind(this);
    }

    /**
     * Check if the user is logged in and then setState if he is. If not, they won't be able to interact with social buttons or comment. 
     */
    componentWillMount() {
        var referThis = this;
        //Load the profile pic 
        this.loadProfilePic();

        firebaseApp.auth().onAuthStateChanged(function (user) {
            if (user) {
                const activeProfileRef = db.collection('users').doc(user.email);
                activeProfileRef.get().then(function (activeSnapshot) {
                    //console.log(activeSnapshot.data().nickname);
                    referThis.setState({
                        activeProfilePic: activeSnapshot.data().profilePic,
                        activeUser: true,
                        activeUserID: user.uid,
                        activeUserName: activeSnapshot.data().userName,
                        activeNickname: activeSnapshot.data().nickname,
                        activeUserEmail: user.email
                    });
                });
            } else {
                referThis.setState({
                    activeUser: false
                });
            }
        });
    }

    /**
     * Load the user's profile Picture.
     */
    loadProfilePic() {
        let referThis = this;
        //Use the user's email to access their profile pic info. 
        console.log(this.props);
        const prof_ref = db.collection('users').doc(this.props.email);
        prof_ref.get().then(function (querySnap) {
            referThis.setState({
                profilePicURL: querySnap.data().profilePic
            });
        });
    }

    render() {
        //Get all the props passed in. 
        const { videoURL, videoDesc, videoTitle, /*likes, dislikes,*/ nickname, /*challenges, tagged*/ } = this.props;
        return (
            <div className="container">
                <div className="card" id="generalCard">
                    <div className="card-block">
                        <div className="singleVideoContainer">
                            <h3>{videoTitle}</h3>
                            <Player poster="" src={videoURL}></Player>
                            <div style={{ margin: '3px' }}>
                                <div className="row sectin group" id="buttonContainerRow">
                                    <div className="col span_1_of_3" id='social_button_box'>
                                        <SocialButtonComponent buttonType="like"
                                            activeUserID={this.state.activeUserID} activeUser={this.state.activeUser}
                                            activeUserEmail={this.state.activeUserEmail} activeNickname={this.state.activeNickname}
                                            videoID={this.props.videoID} uploaderNickname={this.props.nickname} eachKey={this.props.eachKey}
                                        />
                                    </div>
                                    <div className="col span_2_of_3" id='social_button_box'>
                                        <SocialButtonComponent buttonType="challenge"
                                            activeUserID={this.state.activeUserID} activeUser={this.state.activeUser}
                                            profilePicURL={this.state.activeProfilePic} activeUserEmail={this.state.activeUserEmail}
                                            activeUserName={this.state.activeUserName} activeNickname={this.state.activeNickname}
                                            videoID={this.props.videoID} uploaderNickname={this.props.nickname} eachKey={this.props.eachKey}
                                            videoTitle={videoTitle} challengedVideoURL={videoURL}
                                        />
                                    </div>
                                    <div className="col span_3_of_3" id='social_button_box'>
                                        <SocialButtonComponent buttonType="dislike"
                                            activeUserID={this.state.activeUserID} activeUser={this.state.activeUser}
                                            activeUserEmail={this.state.activeUserEmail} activeNickname={this.state.activeNickname}
                                            videoID={this.props.videoID} uploaderNickname={this.props.nickname} eachKey={this.props.eachKey}
                                        />
                                    </div>
                                </div>
                                {//  <div className="row"> 
                                }
                                <div id="picCol">
                                    <Link to={`/users/${nickname}`} >
                                        <img alt={nickname} id="singleCardProfilePic" src={this.state.profilePicURL} />
                                    </Link>
                                </div>
                                <div >
                                    <blockquote><p>{videoDesc}</p></blockquote>
                                    <p id="videoUserName">By <Link to={`/users/${nickname}`} >{nickname}</Link></p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="commentsLink" style={{ textAlign: 'left', marginLeft: '10px', display: this.state.commentsPage }}>
                        <Link to={`/videos/${this.props.videoID}`}>
                            <i className="far fa-comments"></i> Comments
                        </Link>
                    </div>
                </div>
            </div >

        );
    }
}


export default SingleCardContainer;