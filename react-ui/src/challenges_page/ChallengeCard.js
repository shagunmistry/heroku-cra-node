/**
 * Card containers for the challenge page.
 * A person who is challenged, their video will appear on the left. 
 * The person who was the one to challenge the Original User, his video will show on the right. 
 */
import React, { Component } from 'react';
import { Player } from 'video-react';
import HeartButton from './HeartButton';
import './challenges.css';


class ChallengeCard extends Component {
    render() {

        //The information required for the hits stats
        const hitsInformation = this.props.hitsInformation;
        //Get rest of the props
        const { challengeduserName, challengedvideoDesc,
            challengedvideoURL, challengerUniqueKey, challengeruserName,
            challengervideoDesc, challengervideoURL, } = this.props;
        return (
            <div>
                <div className="container">
                    <div className="card groupCard">
                        {/*************************CHALLENGED******************/}
                        <div className="row" id="challengedRow">
                            <div className="col-md-6">
                                <div className="challengedVideo" id="challengeVideos" >
                                    <Player poster="" src={challengedvideoURL}></Player>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div id="videoInfoDiv">
                                    <h4>{challengeduserName}</h4>
                                    <p id="videoDescChallengePage"><i className="fa fa-quote-left"></i>{challengedvideoDesc}</p>
                                </div>
                                <HeartButton
                                    challengedUniqueKey={hitsInformation.challengedUniqueKey}
                                    challengeruserid={hitsInformation.challengeruserid}
                                    challengerUniqueKey={challengerUniqueKey}
                                    decider="1"
                                    idName={hitsInformation.challengedUniqueKey + hitsInformation.challengeruserid} >
                                </HeartButton>
                            </div>

                        </div>
                        {/*************************CHALLENGER******************/}
                        <div className="row" id="challengerRow">
                            <div className="col-md-6">
                                <div id="videoInfoDiv">
                                    <h4>{challengeruserName}</h4>
                                    <p id="videoDescChallengePage"><i className="fa fa-quote-left"></i>{challengervideoDesc}</p>
                                </div>
                                <HeartButton
                                    challengedUniqueKey={hitsInformation.challengedUniqueKey}
                                    challengeruserid={hitsInformation.challengeruserid}
                                    challengerUniqueKey={challengerUniqueKey}
                                    decider="2"
                                    idName={hitsInformation.challengeruserid + hitsInformation.challengedUniqueKey}>
                                </HeartButton>
                            </div>
                            <div className="col-md-6">
                                <div className="challengerVideo" id="challengeVideos">
                                    <Player className="videoChallenge" poster="" src={challengervideoURL}></Player>
                                </div>
                            </div>
                        </div>
                    </div >
                </div>
            </div>
        );
    }
}

export default ChallengeCard;