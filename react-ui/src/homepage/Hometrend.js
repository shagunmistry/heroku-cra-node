/**
 * Home Page screen
 * 
 */
import React, { Component } from 'react';
import CardContainer from '../cards/CardContainer';


class Hometrend extends Component {

    render() {



        return (
            <div className="container">
                <CardContainer />
                {   /* <ModalContainer/> */}
            </div>
        );
    }
}

export default Hometrend;