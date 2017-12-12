import React, { Component } from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import { firebaseApp } from '../firebase/Firebase';
import Keys from '../Pictures/Pic_Keys';
import './navigation.css';



export default class Navigationbar extends Component {
    constructor(props) {
        super(props);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.logOut = this.logOut.bind(this);
        this.editProfie = this.editProfie.bind(this);
    }

    componentDidMount() {
        var profile_options_buttons = document.getElementById('profile_options');
        //check if user is signed in
        firebaseApp.auth().onAuthStateChanged(function (user) {
            //If the user is logged in, display the logout and Edit button, if not. dont. 
            if (user) {
                profile_options_buttons.style.display = 'inherit';
            } else {
                profile_options_buttons.style.display = 'none';
            }
        });
    }

    /**
       * Signout the user and lead them back to the home page. 
       */
    logOut() {
        firebaseApp.auth().signOut().then(function () {
            window.location.replace("/");
        }).catch(function (error) {
            window.alert("There was an error, please try again later");
            window.location.reload();
        });
    }

    /**
     * edit Profile page where you can change your picture and about status
     */
    editProfie() {
        window.location.replace('/EditProfile');
    }


    render() {
        return (
            //make sure all LINKS are wrapped in Router
            <Router>

                <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top">
                    <a className="navbar-brand" href="Hometrend"><img alt="Logo" src={Keys.navbar_brand} width="30" height="30" /></a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#myNavBar" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="myNavBar">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item">
                                <Link id="nav_link" className="nav-link" to="/Hometrend" ><i className="fa fa-home"></i> Home </Link>
                            </li>
                            <li className="nav-item" >
                                <Link className="nav-link" id="nav_link" to="/OngoingChallenges">
                                    <i className="fas fa-chart-bar"></i> Ongoing Challenges</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/UploadVideo" id="nav_link" className="nav-link">
                                    <i className="fa fa-upload"></i><span> Upload Video</span></Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/ProfileCheck" id="nav_link" className="nav-link">
                                    <i className="fa fa-user" ></i> Profile {/*<span className="badge notifications">0</span> */}
                                </Link>
                            </li>
                            <li className="nav-item dropdown" id="profile_options">
                                <a className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i className="fa fa-id-badge"></i>
                                </a>
                                <div className="dropdown-menu" aria-labelledby="navbarDropdown" id="profile_options_btns">
                                    <li><button id="logOutButton" className="dropdown-item btn btn-info btn-4"
                                        type="button" onClick={() => this.logOut()}>Log Out</button>
                                    </li>
                                    <li><button id="editButton" className="dropdown-item btn btn-info"
                                        type="button" onClick={() => this.editProfie()}>Edit Profile </button>
                                    </li>
                                </div>
                            </li>
                        </ul>
                        <form className="form-inline my-2 my-lg-0">
                            <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
                            <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
                        </form>
                    </div>
                </nav>

            </Router >
        );
    }
}
