import React, { Component } from "react";
import Style from "../../../../SharedComponents/Proposals.module.scss";
import Collapse from "@kunukn/react-collapse";
import FormCreate from "../Forms/FormCreate.js";

class CreateProposal extends Component {
  constructor() {
    super();
    this.state = {
      display: false,
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
        <div className={Style.app__first}>
        <button
          className={Style.app__toggle + " " +
            (this.state.display ? Style.app__toggle__active : "")
          }
          onClick={() => this.toggle(1)}
        >
          <span className={Style.app__toggle__text}>Create Proposal</span>
        </button>
        <Collapse
          isOpen={this.state.display}
          className={
            Style.app__collapse + " " + Style.app__collapse__gradient + " " +
            (this.state.display ? Style.app__collapse__active : "")
          }
        >
          <FormCreate web3={this.props.web3} contract={this.props.contract}/>
        </Collapse>
      </div>
    )}
}

export default CreateProposal;