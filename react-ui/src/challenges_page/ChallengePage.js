import React, { Component } from 'react';
//import { Link } from 'react-router-dom';
import { Player } from 'video-react';

import './challenge_page.css';

class ChallengePage extends Component {

    render() {
        return (
            <div>
                <h3 style={{ marginTop: '10px'}}>Who did it better?</h3>
                <div className="row" id="voteRow">
                    <div className="col-md-6" id="voteCol">
                        <img className="voteButton" src="https://s3-us-west-1.amazonaws.com/udacity-content/instructor/michael-jackson%402x-9cjdh42.jpg"
                            id="userPhoto" alt="Challenger" />
                    </div>
                    <div className="col-md-6" id="voteCol">
                        <img className="voteButton" src="https://s3-us-west-1.amazonaws.com/udacity-content/instructor/ryan-florence%402x-9iqlwid.jpg"
                            id="userPhoto" alt="Challenger" />
                    </div>
                </div>
                <div className="card" id="challengerCard">
                    <h5 className="card-header">Challenger 1: </h5>
                    <div className="card-block">
                        <Player id="challengerVideo" src="https://firebasestorage.googleapis.com/v0/b/challengemetest-ea2e0.appspot.com/o/users%2Fshagunmistry%2Fuploaded_video%2FA%20random%20video%20about%20something%20and%20anything%20_GG4i8?alt=media&token=62aafe9b-a452-479a-ba32-91eaf7a92408"
                        ></Player>
                        <div className="infoSection">
                            <div>
                                <img src="https://s3-us-west-1.amazonaws.com/udacity-content/instructor/ryan-florence%402x-9iqlwid.jpg"
                                    id="userPhoto" alt="Challenger" />
                            </div>
                            <div>
                                <h5>Bruce Wayne</h5>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="card" id="challengerCard">
                        <h5 className="card-header">Challenger 2: </h5>
                        <div className="card-block">
                            <Player id="challengerVideo" src="https://firebasestorage.googleapis.com/v0/b/challengemetest-ea2e0.appspot.com/o/users%2Fshagunmistry%2Fuploaded_video%2FA%20random%20video%20about%20something%20and%20anything%20_GG4i8?alt=media&token=62aafe9b-a452-479a-ba32-91eaf7a92408"
                            ></Player>
                        </div>
                        <div className="infoSection">
                            <div>
                                <img src="https://s3-us-west-1.amazonaws.com/udacity-content/instructor/michael-jackson%402x-9cjdh42.jpg"
                                    id="userPhoto" alt="Challenger" />
                            </div>
                            <div>
                                <h5>Wade Wilson</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
}

export default ChallengePage;