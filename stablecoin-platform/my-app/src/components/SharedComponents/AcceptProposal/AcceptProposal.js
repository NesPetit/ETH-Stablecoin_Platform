import React, { Component } from "react";
import Style from "../Proposals.module.scss";
import Collapse from "@kunukn/react-collapse";
import FormAcceptReject from "../Forms/FormAcceptReject";

class AcceptProposal extends Component {
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
        <div className={Style.app}>
        <button
          className={Style.app__toggle + " " +
            (this.state.display ? Style.app__toggle__active : "")
          }
          onClick={() => this.toggle(1)}
        >
          <span className={Style.app__toggle__text}>Accept Proposal</span>
        </button>
        <Collapse
          isOpen={this.state.display}
          className={
            Style.app__collapse + " " + Style.app__collapse__gradient + " " +
            (this.state.display ? Style.app__collapse__active : "")
          }
        >
          <FormAcceptReject web3={this.props.web3} contract={this.props.contract} origin="accept"/>
        </Collapse>
      </div>
    )}
}

export default AcceptProposal;