/**
 * Comment Section 
 * 
 */
import React, { Component } from 'react';
import EachComment from './EachComment';

class Comments extends Component {

    render() {
        return (
            <div>
                <EachComment/>
            </div>
        );
    }
}

export default Comments;