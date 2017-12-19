import React, { Component } from 'react';
import { Player } from 'video-react';
import { Link } from 'react-router-dom';
import firebaseApp from '../firebase/Firebase';
import SocialButtonComponent from '../buttons/SocialButtonComponent';
import './cards.css';
import '../../node_modules/video-react/dist/video-react.css';

var databaseRef = firebaseApp.database();

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
            activeUserName: ""
        })
    }

    /**
     * Check if the user is logged in and then setState if he is. If not, they won't be able to interact with social buttons or comment. 
     */
    componentWillMount() {
        var referThis = this;
        firebaseApp.auth().onAuthStateChanged(function (user) {
            if (user) {
                var activeUserid = user.uid;
                databaseRef.ref('/users/' + activeUserid).on('value', function (snapshot) {
                    referThis.setState({
                        activeProfilePic: snapshot.val().profile_picture,
                        activeUser: true,
                        activeUserID: activeUserid,
                        activeUserName: snapshot.val().username
                    });
                });
            } else {
                referThis.setState({
                    activeUser: false
                })
            }
        });
    }
    render() {
        //Get all the props passed in. 
        const { userid, profilePic, /*videoCategory,*/ videoDesc, videoTitle, videoURL, userName, uniqueKey } = this.props;
        return (
            <div className="container">
                <div className="card" id="generalCard">
                    <div className="card-text">
                        <div className="singleVideoContainer">
                            <h3>{videoTitle}</h3>
                            <Player poster="" src={videoURL}></Player>
                            <div style={{ margin: '3px' }}>
                                <div className="row" id="buttonContainerRow">
                                    <div className="col-md-4 col-xs-6 col-sm-4">
                                        <SocialButtonComponent buttonType="like"
                                            activeUserID={this.state.activeUserID} activeUser={this.state.activeUser}
                                            userid={userid}
                                            uniqueKey={uniqueKey} />
                                    </div>
                                    <div className="col-md-4 col-xs-6 col-sm-4">
                                        <SocialButtonComponent buttonType="challenge"
                                            activeUserID={this.state.activeUserID} activeUser={this.state.activeUser}
                                            userid={userid}
                                            uniqueKey={uniqueKey} profilePicURL={this.state.activeProfilePic}
                                            activeUserName={this.state.activeUserName} />
                                    </div>
                                    <div className="col-md-4 col-xs-6 col-sm-4">
                                        <SocialButtonComponent buttonType="dislike"
                                            activeUserID={this.state.activeUserID} activeUser={this.state.activeUser}
                                            userid={userid}
                                            uniqueKey={uniqueKey} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-4 col-xs-6 col-sm-4">
                                        <Link to={`/users/${userName}`} >
                                            <img src={profilePic} alt="Profile Pic" id="singleCardProfilePic" />
                                        </Link>
                                    </div>
                                    <div className="col-md-8 col-xs-12 col-sm-8">
                                        <blockquote><p>{videoDesc}</p></blockquote>
                                        <p id="videoUserName">-{userName}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    { /*** COMMENT SECTION ***********/}
                </div>
            </div>

        );
    }
}


export default SingleCardContainer;