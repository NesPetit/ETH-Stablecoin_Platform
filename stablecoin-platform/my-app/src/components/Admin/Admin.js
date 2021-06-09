import React, { Component } from 'react'
import { Container, Row, Col, Card, CardBody, TabContent, TabPane } from "reactstrap";
import { MDBDataTable } from "mdbreact";
import { truncStringPortion } from '../SharedComponents/Helpers/formatter';
import Web3 from 'web3'
import addresses from "../../addresses.json"
import adminAbi from "../../Json_contracts/AdminMultisig.json"
import SideContainer from "./AdminComponents/SideContainer.js";
import Style from "./Admin.module.scss"
import SVGLogo from "../SharedComponents/SVGLogo/SVGLogo";
import alias from "../../aliases";

export default class Admin extends Component {
    _isMounted = false;
    constructor(props) {
        super(props)
        this.state = { 
          accounts:[],
          aliases: alias,
          contract: null,
          web3: props.web3,
          activeTab : '1',
          transactions: {
            columns: [
                {
                  label: "Proposal ID",
                  field: "proposalId",
                  sort: "asc",
                  width: 136
                },
                {
                  label: "Proposal Type",
                  field: "proposalType",
                  sort: "asc",
                  width: 136
                },
                {
                  label: "Date",
                  field: "date",
                  sort: "asc",
                  width: 136
                },
                {
                  label: "Parameters",
                  field: "parameters",
                  width: 264
                },
                {
                  label: "Approvals",
                  field: "approvals",
                  sort: "asc",
                  width: 104
                },
                {
                  label: "Rejects",
                  field: "rejects",
                  sort: "asc",
                  width: 104
                },
                {
                  label: "Status",
                  field: "status",
                  sort: "asc",
                  width: 104
                },
                {
                  label: "Actions",
                  field: "action",
                  sort: "asc",
                  width: 100
                }
              ],
              rows: [ ]
          },
          limit: false,
          loading: true,
        }
        this.toggleTab = this.toggleTab.bind(this);
        this.handleChange.bind(this);
    }

    handleChange = date => {
        this.setState({
          startDate: date
        });
    };

    toggleTab(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab,
                aliases: []
            });
        }
    }
    
    async InitiateContract(){
        var myContract = new this.state.web3.eth.Contract(adminAbi.abi, addresses.adminMultisig)
        const accounts = await this.state.web3.eth.getAccounts()
        this.setState({accounts:accounts,contract:myContract})
    }
    
    async componentDidMount() {
        this._isMounted = true;
        await this.InitiateContract();
        try{
            var allProposalsId = await this.state.contract.methods.getAllProposalsId().call();
            allProposalsId.forEach(async id => {
                var proposal = await this.state.contract.methods.getProposalById(id).call();
                const rejects = proposal[9].length;
                const accepts = proposal[8].length;

                console.log(proposal);
                let row = {
                    proposalId: Web3.utils.hexToAscii(proposal[0]),
                    proposalType: Web3.utils.hexToAscii(proposal[5]),
                    // date: proposal.meta.time.replace('T', ' ').replace('Z', ''),
                //     parameters : <span className="badge font-size-9 text-left">
                //     { proposal[5] === 'transfer' && Object.keys(proposal).map((e, i) =>
                //         !["contractAddr", "operation", "status", "approvals", "rejects", "state"].includes(e) &&
                //             <div key={i} className="mt-1">
                //             {e === 'f'? 'From' : e === 't'? 'To' : e}: {["amount", "balance"].includes(e)?
                //                     <span>{parseFloat(proposal[e]/100)} <SVGLogo width="13" height="13"/></span>
                //                 :
                //                     this.state.aliases[proposal[e].toString()] && this.state.aliases[proposal[e].toString()].name?
                //                         this.state.aliases[proposal[e].toString()].name
                //                     :
                //                         proposal[e].toString().length > 14 ?
                //                             truncStringPortion(proposal[e].toString(), 8, 6)
                //                         :
                //                             proposal[e].toString()
                //                 }
                //             </div>
                //     )}
                //     { proposal[5] === 'setPause' &&
                //         <div className="mt-1">
                //             Status: {proposal[7].toString() === 'true'? <span className="badge badge-danger">Transfers Paused</span> : <span className="badge badge-success">Transfers Active</span>}
                //         </div>
                //     }
                //     { proposal[5] === 'setWhiteListing' &&
                //         <>
                //             <div className="mt-1">
                //                 Address: {this.state.aliases[proposal[6]] && this.state.aliases[proposal[6]].name? this.state.aliases[proposal[6]].name : truncStringPortion(proposal[6], 8, 6)}<br/>
                //             </div>
                //             <div className="mt-1">
                //                 Status: {proposal.value.state.toString() === 'true'? <span className="badge badge-success">Approved</span> : <span className="badge badge-danger">Unapproved</span>}
                //             </div>
                //         </>
                //     }
                //     { proposal[5] === 'setLock' &&
                //         <>
                //             <div className="mt-1">
                //                 Address: {this.state.aliases[proposal[6]] && this.state.aliases[proposal[6]].name? this.state.aliases[proposal[6]].name : truncStringPortion(proposal[6], 8, 6)}<br/>
                //             </div>
                //             <div className="mt-1">
                //                 Status: {proposal[7].toString() === 'true'? <span className="badge badge-danger">Locked</span> : <span className="badge badge-success">Unlocked</span> }
                //             </div>
                //         </>
                //     }
                // </span>,
                    approvals: <span className={"font-size-9 text-left " + Style.badge}>{proposal[8].map(approval =>  <div key={approval} className="mt-1">{this.state.aliases[approval] && this.state.aliases[approval].name? this.state.aliases[approval].name : truncStringPortion(approval, 8, 8)}</div>)}</span>,     
                    rejects: <span className={"font-size-9 text-left " + Style.badge}>{proposal[9].map(reject =>  <div key={reject} className="mt-1">{this.state.aliases[reject] && this.state.aliases[reject].name? this.state.aliases[reject].name : truncStringPortion(reject, 8, 6)}</div>)}</span>,
                    status: <b>{proposal[7].toString() === 'true'? 'Closed' : 'Pending'}<br/>{proposal[7] && rejects > accepts && <span className={"badge-danger " + Style.fontSize10 + " " + Style.badge}>Rejected</span>}{proposal[7] && accepts > rejects && <span className={"badge-success " + Style.fontSize10 + " " + Style.badge}>Accepted</span>}{!proposal[7] && <span className={"badge-warning " + Style.fontSize10 + " " + Style.badge}>Open</span>}</b>
                    // action: 
                };
                if (this._isMounted) {
                    this.setState({
                        transactions: {columns: [...this.state.transactions.columns], rows: [...this.state.transactions.rows, row]},
                    }); }
            });
        } catch(error) {
            console.error(error);
        }
    }
    componentWillUnmount() {
        this._isMounted = false;
      }
    render() {
        return (
            <React.Fragment>
              <div style={{"display":"flex"}}> 
                    <SideContainer web3={this.state.web3} contract={this.state.contract}/>
                    <div className = {Style.rightChild}>
                        <Container fluid className={Style.container} style={{"height":"100%"}}> 
                            <Row>
                                <Col lg="12">
                                    <Card className={Style.cardMargin}>
                                        <CardBody>
                                            <h4 className={Style.cardTitle}>ADMIN PROPOSALS</h4>
                                            <TabContent activeTab={this.state.activeTab} className="p-3">
                                                <TabPane tabId="1" id="all-order">
                                                    <MDBDataTable entriesLabel="Show entries" info={false} noBottomColumns responsive bordered data={this.state.transactions} order={['date', 'desc' ]} className={"mt-1 " + Style.tableHead  + " " + Style.tableBody}  />
                                                </TabPane>
                                            </TabContent>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                        </Container>
                        <footer className={Style.footer}>
                            <Container fluid={true}>
                                <Row>
                                    <Col style={{"display":"flex", "justifyContent": "flex-end"}}>
                                        {new Date().getFullYear()} © ESILV.
                                    </Col>
                                </Row>
                            </Container>
                         </footer>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
