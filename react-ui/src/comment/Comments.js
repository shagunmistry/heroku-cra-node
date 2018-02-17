/**
 * Comment Section 
 * 
 */
import React, { Component } from 'react';
import EachComment from './EachComment';
import SingleCardContainer from '../cards/SingleCardContainer';
require('firebase/firestore');

var firebase = require('firebase');
var db = firebase.firestore();
var videoDetailArray = [], userInfo = {};

class Comments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            waiting: true
        }

        this.uniqueKeyCreator = this.uniqueKeyCreator.bind(this);
    }


    /**Create a unique key for each card to distinguish between each one  */
    uniqueKeyCreator() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 5; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }


    componentWillMount() {
        //Find the video by using the ParamsID - videoid
        var videoRef = db.collection('all_videos').doc(this.props.match.params.videoid), referThis = this;
        this.setState({
            waiting: true
        });

        videoRef.get().then(function (videoData) {
            if (videoData && videoData.exists) {
                userInfo.videoURL = videoData.data().videoURL;
                userInfo.videoDesc = videoData.data().videoDesc;
                userInfo.videoTitle = videoData.data().title;
                userInfo.likes = videoData.data().likes;
                userInfo.dislikes = videoData.data().dislikes;
                userInfo.challenges = videoData.data().challenges;
                userInfo.nickname = videoData.data().nickname;
                userInfo.tagged = videoData.data().tagged;
                userInfo.email = videoData.data().email;
                userInfo.eachKey = referThis.uniqueKeyCreator();
                userInfo.videoID = referThis.props.match.params.videoid;
                console.log(userInfo.videoID);

                if (userInfo.email != undefined) {
                    referThis.setState({
                        waiting: false
                    });
                }
            } else {
                console.log("This video does not exist any more");
            }
        }).catch({
            function(error) {
                console.log(Error.toString());
            }
        })
    }
    render() {
        if (this.state.waiting) {
            return (
                <div>
                    Loading.....
                </div>
            )
        }
        return (
            <div>
                <SingleCardContainer
                    videoURL={userInfo.videoURL}
                    videoDesc={userInfo.videoDesc}
                    videoTitle={userInfo.videoTitle}
                    tagged={userInfo.tagged}
                    likes={userInfo.likes}
                    dislikes={userInfo.dislikes}
                    challenges={userInfo.challenges}
                    nickname={userInfo.nickname}
                    email={userInfo.email}
                    eachKey={userInfo.eachKey}
                    videoID={userInfo.videoID}
                    commentsPage={true}
                />
                <EachComment />
                <EachComment />
                <EachComment />
                <EachComment />
                <EachComment />
                <EachComment />
                <EachComment />
                <EachComment />
                <EachComment />
                <EachComment />
                <EachComment />
                <EachComment />
            </div>
        );
    }
}

export default Comments;