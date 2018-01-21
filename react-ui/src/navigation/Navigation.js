import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import firebaseApp from '../firebase/Firebase';
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
                <nav className="navbar navbar-expand-lg sticky-top" id="main_nav">
                    <a className="navbar-brand" href="/"><img alt="Logo" src={Keys.navbar_brand} width="30" height="30" /></a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#myNavBar" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <i className="fas fa-chevron-circle-down" id="navbar_toggler"></i>
                    </button>

                    <div className="collapse navbar-collapse" id="myNavBar">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item">
                                <a id="nav_link" className="nav-link" href="/Hometrend" ><i className="fa fa-home"></i> Home </a>
                            </li>
                            <li className="nav-item" >
                                <a className="nav-link" id="nav_link" href="/trending-challenges">
                                    <i className="fas fa-chart-bar"></i> Ongoing Challenges</a>
                            </li>
                            <li className="nav-item">
                                <a href="/Upload" id="nav_link" className="nav-link">
                                    <i className="fa fa-upload"></i><span> Upload Video</span></a>
                            </li>
                            <li className="nav-item">
                                <a href="/check_user_status" id="nav_link" className="nav-link">
                                    <i className="fa fa-user" ></i> Profile {/*<span className="badge notifications">0</span> */}
                                </a>
                            </li>
                            <li className="nav-item dropdown" id="profile_options">
                                <a className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i className="fa fa-id-badge"></i>
                                </a>
                                <div className="dropdown-menu text-center" aria-labelledby="navbarDropdown" id="profile_options_btns">
                                    <button id="logOutButton" className="dropdown-item btn btn-info btn-4"
                                        type="button" onClick={() => this.logOut()}>Log Out</button>
                                    <button id="editButton" className="dropdown-item btn btn-info"
                                        type="button" onClick={() => this.editProfie()}>Edit Profile </button>
                                </div>
                            </li>
                        </ul>
                        <form className="form-inline my-2 my-lg-0" id="search_box">
                            <input  className="form-control mr-sm-2" type="search" placeholder="Search..." aria-label="Search" />
                            <button className="btn btn-outline-danger my-2 my-sm-0" type="submit">Search</button>
                        </form>
                    </div>
                </nav>

            </Router >
        );
    }
}
