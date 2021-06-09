import React, { Component } from "react";
import Style from "../../../../SharedComponents/Proposals.module.scss";
import Collapse from "@kunukn/react-collapse";
import FormAddressProposal from "./FormAddressProposal.js";

class AddressProposal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      display: false
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle = () => {
    this.setState(prevstate => ({
      display: !prevstate.display,
    }));
  };
  
  render() {
    return (
        <div className={Style.app__firstBis}>
        <button
          className={Style.app__toggle + " " +
            (this.state.display ? Style.app__toggle__active : "")
          }
          onClick={() => this.toggle(1)}
        >
          <span className={Style.app__toggle__text}>Address Proposal</span>
        </button>
        <Collapse
          isOpen={this.state.display}
          className={
            Style.app__collapse + " " + Style.app__collapse__gradient + " " +
            (this.state.display ? Style.app__collapse__active : "")
          }
        >
          <FormAddressProposal web3={this.props.web3} contract={this.props.contract}/>
        </Collapse>
      </div>
    )}
}

export default AddressProposal;