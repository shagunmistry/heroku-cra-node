import React, { Component } from 'react';

var firebase = require('firebase');
var db = firebase.firestore();

/**Style of the card */
var styles = {
    mainCard: {
        width: '500px',
        padding: '5px',
        marginTop: '10%',
        boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)'
    },
    cardHeader: {
        backgroundColor: 'white',
        color: 'green',
    },
    createButton: {
        marginTop: '5px',
    }
}

class CreateNickname extends Component {
    constructor(props) {
        super(props);
        this.checkNickname = this.checkNickname.bind(this);
    }

    /**
     * Check if the nickname already exists
     */
    checkNickname() {
        var referThis = this;
        //get the input value
        const nickname = document.getElementById('nickname').value;
        const nicknameCollection = db.collection('nicknames').doc(nickname);
        const userRef = db.collection('users').doc(this.props.email);
        nicknameCollection.get().then(function (doc) {
            if (doc && doc.exists) {
                //if the nickname already exists, let the user know. 
                document.getElementById('verification').innerText = 'Nickname already taken';
            } else {
                //if it is not already taken, then create one
                nicknameCollection.set({
                    uid: referThis.props.uid,
                    email: referThis.props.email
                }, { merge: true }).then(function () {
                    //On success, redirect them to their profile page. 
                    userRef.set({
                        first: 'false',
                        nickname: nickname
                    }, { merge: true }).then(function () {
                        userRef.get().then(function (snapshot) {
                            if (snapshot.exists) {
                                if (snapshot.data().profilePic === "" || snapshot.data().profilePic === undefined) {
                                    window.location.replace('/EditProfile');
                                } else {
                                    window.location.replace('/check_user_status');
                                }
                            }
                        }).catch(() => {
                            console.log("There was error in the login process. Please contact your admin!");
                        })
                    });
                    //Check if their profile pic is empty, if so lead them to the profile page. 

                });
            }
        });
    }

    render() {
        return (
            <div className="container">
                <div className="card" style={styles.mainCard}>
                    <h2 className="card-header" style={styles.cardHeader}>Please create your nickname</h2>
                    <div className="card-block">
                        <input className="form-control" id="nickname" placeholder="Please create a new nickname" />
                        <small id="verification" className="form-text text-muted" ></small>
                        <button type="button" className="btn btn-outline-success" style={styles.createButton}
                            onClick={() => this.checkNickname()}
                        >Create!</button>
                    </div>
                </div>
            </div>

        );
    }
}


export default CreateNickname;