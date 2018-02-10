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
            <section>
                <div id="picCol">
                    <Link to={`/users/$someone`} >
                        <img alt="Someone" id="singleCardProfilePic" src='https://firebasestorage.googleapis.com/v0/b/challengemetest-ea2e0.appspot.com/o/users%2FE9U2gAoOE6R57nCDhjE7txLrSxO2%2Fimages%2Fbatman.jpg?alt=media&token=7811677b-89d0-4990-b5c1-c81cde099137' />
                    </Link>
                </div>
                <div id='comment_text'>
                    <blockquote><p>This is a sample comment</p></blockquote>
                </div>
            </section>
        );
    }
}

export default EachComment;