import React, { Component } from 'react';
import Style from './SideContainer.module.scss';
import CreateProposal from './SideContent/CreateProposal/CreateProposal';
import AcceptProposal from '../../SharedComponents/AcceptProposal/AcceptProposal';
import RejectProposal from '../../SharedComponents/RejectProposal/RejectProposal';


// import Demo3 from './SideContent/Demo3';

export default class SideContainer extends Component {

  render() {
    return (
      <div className={Style.container}>
        <CreateProposal web3={this.props.web3} contract={this.props.contract}/>
        <AcceptProposal web3={this.props.web3} contract={this.props.contract}/>
        <RejectProposal web3={this.props.web3} contract={this.props.contract}/>
     </div>

    );
  }

}