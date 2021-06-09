import React, { Component } from 'react';
import Style from './SideContainer.module.scss';
import AcceptProposal from '../../SharedComponents/AcceptProposal/AcceptProposal';
import RejectProposal from '../../SharedComponents/RejectProposal/RejectProposal';
import MintProposal from './SideContent/MintProposal/MintProposal';
import BurnProposal from './SideContent/BurnProposal/BurnProposal';

export default class SideContainer extends Component {


  render() {
    return (
      <div className={Style.container}>
        {console.log("contract from sideContainer minter : ", this.props.contract)}
        <MintProposal web3={this.props.web3} contract={this.props.contract} />
        <BurnProposal web3={this.props.web3} contract={this.props.contract} />
        <AcceptProposal web3={this.props.web3} contract={this.props.contract} />
        <RejectProposal web3={this.props.web3} contract={this.props.contract} />
      </div>
    );
  }
}