import React, { Component } from 'react'
import { Container, Row, Col, Card, CardBody, TabContent, TabPane } from "reactstrap";
import { MDBDataTable } from "mdbreact";
import Web3 from 'web3'
import addresses from "../../addresses.json"
import ownerAbi from "../../Json_contracts/OwnerMultisig.json"
import { truncStringPortion } from '../SharedComponents/Helpers/formatter';
import SideContainer from "./OwnerComponents/SideContainer.js";
import Style from "./Owner.module.scss"
import alias from "../../aliases";


export default class Owner extends Component {
    _isMounted = false;
    static contractAddress= addresses["ownerMultisig"]
    constructor(props) {
        super(props)
        this.state = { 
          accounts: [],
          network:'',
          aliases: alias,
          contract: null,
          web3: props.web3,
          proposalCount: 0,
          startDate: new Date (),
          activeTab: '1',
          transactions: {
              columns: [
                    {
                        label: "Proposal ID",
                        field: "proposalId",
                        sort: "asc",
                        width: 136
                    },
                    {
                        label: "Operation",
                        field: "operation",
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
                        label: "Address",
                        field: "address",
                        sort: "asc",
                        width: 136
                    },
                    {
                        label: "Approvals",
                        field: "approvals",
                        sort: "asc",
                        width: 136
                    },
                    {
                        label: "Rejects",
                        field: "rejects",
                        sort: "asc",
                        width: 136
                    },
                    {
                      label: "Status",
                      field: "status",
                      sort: "asc",
                      width: 104
                    },
                    {
                        label: "Actions",
                        field: "actions",
                        sort: "asc",
                        width: 104
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
        var myContract = new this.state.web3.eth.Contract(ownerAbi.abi, addresses["ownerMultisig"])
        const accounts = await this.state.web3.eth.getAccounts()
        this.setState({accounts:accounts,contract:myContract})
    }

    async componentDidMount() {
        this._isMounted = true;
        await this.InitiateContract();
        try{
            var allProposalsId = await this.state.contract.methods.getAllProposalsId().call();
            allProposalsId.forEach(async id => {
                const proposal = await this.state.contract.methods.getProposalById(id).call();
                const accepts = proposal[4].length;
                const rejects = proposal[5].length;
                let row = {
                        proposalId: Web3.utils.hexToAscii(proposal[0]),
                        address : this.state.aliases[proposal[1].toString()] && this.state.aliases[proposal[1].toString()].name ? this.state.aliases[proposal[1].toString()].name : proposal[1].toString(),
                        approvals: <span className={"font-size-9 text-left " + Style.badge}>{proposal[4].map(approval =>  <div key={approval} className="mt-1">{this.state.aliases[approval] && this.state.aliases[approval].name? this.state.aliases[approval].name : truncStringPortion(approval, 8, 6)}</div>)}</span>,     
                        rejects: <span className={"font-size-9 text-left " + Style.badge}>{proposal[5].map(reject =>  <div key={reject} className="mt-1">{this.state.aliases[reject] && this.state.aliases[reject].name? this.state.aliases[reject].name : truncStringPortion(reject, 8, 6)}</div>)}</span>,
                        status: <b>{proposal[6].toString() === 'true'? 'Closed' : 'Pending'}<br/>{proposal[5] && rejects > accepts && <span className={"badge-danger " + Style.fontSize10 + " " + Style.badge}>Rejected</span>}{proposal[5] && accepts > rejects && <span className={"badge-success " + Style.fontSize10 + " " + Style.badge}>Accepted</span>}{!proposal[5] && <span className={"badge-warning " + Style.fontSize10 + " " + Style.badge}>Open</span>}</b>
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
                                                <h4 className={Style.cardTitle}> OWNER PROPOSALS</h4>
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