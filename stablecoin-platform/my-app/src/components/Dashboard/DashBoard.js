import React, { Component } from "react";

// Pages Components
import WelcomeComp from "./DashboardComps/WelcomeComp";
import StorageComp from "./DashboardComps/StorageComp";
import CirculatingSupply from "./DashboardComps/CirculatingSupply";
import ReserveBalance from "./DashboardComps/ReserveBalance";
import LatestProposals from "./DashboardComps/LatestProposals";

import Style from "./Dashboard.module.scss"

export default class DashBoard extends Component {
    constructor(props){
        super(props);
        this.state = {
            web3: props.web3
        }
    }

    render() {  
        return (
            <React.Fragment>
                <div className={Style.pageContent}>
                    <div className={Style.containerFluid}>
                        <div className={Style.row}>
                            <div className={Style.colXl4}>
                                <WelcomeComp />
                                <StorageComp />
                            </div>
                            <div className={Style.colXl8}>
                                <div className={Style.row}>
                                    <CirculatingSupply/>
                                    <ReserveBalance />
                                </div>
                                <div className={Style.row}>
                                    <LatestProposals web3={this.state.web3}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
        
    }
}
