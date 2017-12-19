/**
*   User's Profile card at the top of the profile page
    PROPS: userId, visitorTag, visitorId <-- will be empty if the user is not logged in. 
*/
import React, { Component } from 'react';
//import firebaseApp from '../firebase/Firebase';
require('./profile_page.css');


class Profilecard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            followCount: 0,
            challengesCount: 0
        };
    }

    render() {
        return (
            <div className="card" id="profile_card">
                <div className="row">
                    <div className="col-sm-3 col-md-2">
                        <img id="profile_pic" src="https://media.caranddriver.com/images/08q4/267455/dodge-challenger-blacktop-concept-photo-232909-s-450x274.jpg" alt="This is __ profile" />
                    </div>
                    <div className="col-sm-10 col-md-9 info_section">
                        <div className="row" id="test_row">
                            <div className="col-sm-12">
                                <h3 id="user_name">Shagun Mistry</h3>
                                <h6 id="user_punchline">Entrepreneur, Socialist, Philanthropist</h6>
                            </div>

                        </div>
                        <div className="row" id="test_row">
                            <div className="col-sm-5 col-xs-4 col-md-3">
                                <button type="button" className="btn btn-danger option_buttons" id="follower_count" title="Followers"
                                >{/*<i className="fa fa-users"></i> */} Followers | {this.state.followCount} </button>
                            </div>
                            <div className="col-sm-5 col-xs-4 col-md-3">
                                <button type="button" className="btn btn-danger option_buttons" id="challenges_count"
                                    title="Challenges">{/*<i className="fa fa-shield"></i> */} Challenges | {this.state.challengesCount}</button>
                            </div>
                            <div className="col-sm-4 col-xs-4 col-md-3">
                                <button id="aboutMe" type="button" className="btn btn-success option_buttons"
                                    data-toggle="collapse" data-target="#about_section">About </button>
                            </div>
                        </div>
                        <div className="row" id="test_row">
                            <div className="col-sm-12 collapse" id="about_section">About Section</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Profilecard;