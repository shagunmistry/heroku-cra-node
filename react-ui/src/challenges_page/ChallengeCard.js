import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './challenge_page.css';

class ChallengeCard extends Component {

    render() {
        const { challenged, challenger, challengedVotes, challengerVotes, challengerVideoTitle, challengedVideoTitle } = this.props;
        return (
            <div>
                <br />
                <div className="card challengeCard">
                    <div className="card-block">
                        <div className="row">
                            <div className="col-md-6 col-sm-6" style={{ width: 'auto' }} id="photo_row">
                                <img src="https://s3-us-west-1.amazonaws.com/udacity-content/instructor/michael-jackson%402x-9cjdh42.jpg"
                                    id="userPhoto" alt="Challenger" />
                            </div>
                            <div className="col-md-6 col-sm-6" style={{ width: 'auto' }} id="photo_row">
                                <img src="https://s3-us-west-1.amazonaws.com/udacity-content/instructor/ryan-florence%402x-9iqlwid.jpg"
                                    id="userPhoto" alt="Challenger" />
                            </div>
                        </div>
                        <br />
                        <div className="challengers">
                            <h4 id="challenger">{challenger}</h4>
                            <p id="videoName">{challengerVideoTitle}</p>
                            <img src="https://firebasestorage.googleapis.com/v0/b/challengemetest-ea2e0.appspot.com/o/line_with_bolt.png?alt=media&token=e1e42f59-ea6b-460b-93ab-5a7d9c4e1037"
                                id="challenger_line" alt="challenger_line" />
                            <h4 id="challenger">{challenged}</h4>
                            <p id="videoName">{challengedVideoTitle}</p>
                        </div>
                    </div>
                    <div className="card-footer">
                        <Link to={`/challenge/$challengeid`}>
                            <i className="fas fa-plus"></i> Show Challenge
                        </Link>
                    </div>
                </div>
            </div>
        )
    }
}

export default ChallengeCard;