import React, { Component } from 'react';
import Style from './SideContainer.module.scss';
import AcceptProposal from '../../SharedComponents/AcceptProposal/AcceptProposal';
import RejectProposal from '../../SharedComponents/RejectProposal/RejectProposal';
import AddressProposal from './SideContent/AddressProposal/AddressProposal';
import PauseProposal from './SideContent/PauseProposal/PauseProposal';
import TransferProposal from './SideContent/TransferProposal/TransferProposal';


export default class SideContainer extends Component {  

  render() {
    return (
      <div className={Style.container}>
        {console.log("contract from sideContainer admin : ", this.props.contract)}
        <PauseProposal web3={this.props.web3} contract={this.props.contract} />
        <AddressProposal web3={this.props.web3} contract={this.props.contract} />
        <TransferProposal web3={this.props.web3} contract={this.props.contract} />
        <AcceptProposal web3={this.props.web3} contract={this.props.contract} />
        <RejectProposal web3={this.props.web3} contract={this.props.contract} />
      </div>
    )
  }
}