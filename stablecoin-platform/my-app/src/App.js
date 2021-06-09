import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Web3 from 'web3'

import Header from './components/Header/Header.js';
// import Accueil from './components/Accueil.js';
import Owner from './components/Owner/Owner.js';
import Admin from './components/Admin/Admin.js';
import Minter from './components/Minter/Minter.js';
import Reserve from './components/Reserve/Reserve.js';
import DashBoard from './components/Dashboard/DashBoard.js'
import './App.css';



export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      web3: new Web3(Web3.givenProvider || "http://localhost:7545"),
      network:''
    }
}
  async componentDidMount(){
    Web3.givenProvider.enable();
    const network = await this.state.web3.eth.net.getNetworkType();
    this.setState({ network: network });
  }

  render() {
    return (
      <Router>
        <Header/>
         <Route path ="/" exact component={() => <DashBoard web3={this.state.web3} />}/>
         <Route path="/Owner" component={() => <Owner web3={this.state.web3} />} />
         <Route path="/Admin" component={() => <Admin web3={this.state.web3} />}/>
         <Route path="/Minter" component={() => <Minter web3={this.state.web3} />} />
         <Route path="/Reserve" component={() => <Reserve web3={this.state.web3} />} />
      </Router>
  )
  }
}
