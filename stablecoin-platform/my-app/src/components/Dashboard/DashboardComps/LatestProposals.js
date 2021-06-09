import React, { Component } from "react";
import { Container, Row, Col, Card, CardBody, TabContent, TabPane } from "reactstrap";
import { MDBDataTable } from "mdbreact";
import { truncStringPortion } from '../../SharedComponents/Helpers/formatter';
import Web3 from "web3"
import addresses from "../../../addresses.json";
import reserveAbi from "../../../Json_contracts/AdminMultisig.json";
import Style from "../Dashboard.module.scss";
import alias from "../../../aliases";

// In this component we display the 6 latest operations.
// Need to order by time of operation and selecting 6 latests.

class LatestProposals extends Component {
    _isMounted = false;
    constructor(props){
        super(props);
        this.state = {
            accounts: [],
            aliases: alias,
            contract: null,
            web3: props.web3,
            startDate : new Date (),
            activeTab : '1',
            transactions: {
                columns: [
                    {
                        label: "Operation ID",
                        field: "operationId",
                        sort: "asc",
                        width: 136
                    },
                    {
                        label: "Operation Type",
                        field: "operationType",
                        sort: "asc",
                        width: 136
                    },
                    {
                        label: "Date",
                        field: "date",
                        sort: "asc",
                        width: 104
                    },
                    {
                        label: "Parameters",
                        field: "parameters",
                        width: 160
                      },
                      {
                        label: "Caller",
                        field: "caller",
                        sort: "asc",
                        width: 104
                      },
                ],
                rows: [
                    {
                        operationId: 'Shad Decker',
                        operationType: 'Regional Director',
                        date: '2008/11/13',
                        parameters: '$183',
                        caller: "ok"
                    },
                    {
                        operationId: 'Shad Decker',
                        operationType: 'Regional Director',
                        date: '2008/11/13',
                        parameters: '$183',
                        caller: "ok"
                    },
                    {
                        operationId: 'Shad Decker',
                        operationType: 'Regional Director',
                        date: '2008/11/13',
                        parameters: '$183',
                        caller: "ok"
                    },
                    {
                        operationId: 'Shad Decker',
                        operationType: 'Regional Director',
                        date: '2008/11/13',
                        parameters: '$183',
                        caller: "ok"
                    },
                    {
                        operationId: 'Shad Decker',
                        operationType: 'Regional Director',
                        date: '2008/11/13',
                        parameters: '$183',
                        caller: "ok"
                    },
                    {
                        operationId: 'Shad Decker',
                        operationType: 'Regional Director',
                        date: '2008/11/13',
                        parameters: '$183',
                        caller: "ok"
                    },
                ]
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
            });
        }
    }

    async InitiateContract(){
        let myContract = new this.state.web3.eth.Contract(reserveAbi.abi, addresses.reserveMultisig);
        const accounts = await this.state.web3.eth.getAccounts();
        this.setState({accounts:accounts, contract:myContract});
    }

    async componentDidMount() {
        this._isMounted = true;
        await this.InitiateContract();
        // try{
        //     var allProposalsId = await this.state.contract.methods.getAllProposalsId().call();
        //     allProposalsId.forEach(async id => {
        //         const proposal = await this.state.contract.methods.getProposalById(id).call();
        //         const accepts = proposal[6].length;
        //         const rejects = proposal[7].length;
        //         let row = {
        //                 proposalId: Web3.utils.hexToAscii(proposal[0]),
        //                 amount : <span>{proposal[2].toString()} <SVGLogo width="13" height="13"/></span>,
        //                 receiver : this.state.aliases[proposal[3].toString()] && this.state.aliases[proposal[3].toString()].name ? this.state.aliases[proposal[3].toString()].name : proposal[3].toString(),
        //                 approvals: <span className={"font-size-9 text-left " + Style.badge}>{proposal[6].map(approval =>  <div key={approval} className="mt-1">{this.state.aliases[approval] && this.state.aliases[approval].name? this.state.aliases[approval].name : truncStringPortion(approval, 8, 6)}</div>)}</span>,     
        //                 rejects: <span className={"font-size-9 text-left " + Style.badge}>{proposal[7].map(reject =>  <div key={reject} className="mt-1">{this.state.aliases[reject] && this.state.aliases[reject].name? this.state.aliases[reject].name : truncStringPortion(reject, 8, 6)}</div>)}</span>,
        //                 status: <b>{proposal[5].toString() === 'true'? 'Closed' : 'Pending'}<br/>{proposal[5] && rejects > accepts && <span className={"badge-danger " + Style.fontSize10 + " " + Style.badge}>Rejected</span>}{proposal[5] && accepts > rejects && <span className={"badge-success " + Style.fontSize10 + " " + Style.badge}>Accepted</span>}{!proposal[5] && <span className={"badge-warning " + Style.fontSize10 + " " + Style.badge}>Open</span>}</b>
        //         };
        //         if (this._isMounted) {
        //             this.setState({
        //                 transactions: {columns: [...this.state.transactions.columns], rows: [...this.state.transactions.rows, row]},
        //             }); }
        //     });
        // } catch(error) {
        //     console.error(error);
        // }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        return (
            <React.Fragment>
                <Container fluid className={Style.container}> 
                    <Row>
                        <Col lg="12">
                            <Card>
                                <CardBody>
                                    <h4 className={Style.cardTitleLatestProposal}>Latest Lugh operations</h4>
                                    <TabContent activeTab={this.state.activeTab} className="p-3">
                                        <TabPane tabId="1" id="all-order">
                                            <MDBDataTable entriesLabel="Show entries" paging={false} searching={false} info={false} noBottomColumns responsive bordered data={this.state.transactions} order={['date', 'desc' ]} className={"mt-1 " + Style.tableHead  + " " + Style.tableBody}  />
                                        </TabPane>
                                    </TabContent>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </React.Fragment>
        )
    }
}

export default LatestProposals;