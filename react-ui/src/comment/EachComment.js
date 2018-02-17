/**
 * Each Comment Box
 * 
 */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
require('./comments.css');

class EachComment extends Component {

    render() {
        return (
            <section id="eachCommentsSection" className="container">
                <div id="picCol">
                    <Link to={`/users/$someone`} >
                        <img alt="Someone" id="singleCardProfilePic" src='https://firebasestorage.googleapis.com/v0/b/challengemetest-ea2e0.appspot.com/o/users%2Fshagunmistry%2Fprofile_pictures%2FProfile_pic_2.jpeg?alt=media&token=be420f75-43d4-4117-91c2-403d927e1fe2' />
                    </Link>
                </div>
                <div id='comment_text'>
                    <p>This is a sample comment.</p>
                </div>
            </section>
        );
    }
}

export default EachComment;