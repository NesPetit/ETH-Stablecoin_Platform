// SPDX-License-Identifier: MIt
pragma solidity >=0.4.22 <0.8.0;
import "./InterfaceStablecoin.sol";

// import 'lugh_coin.sol'; -> We will probably need to import lugh_coin contract to do a proper call of transfer function
// And create an interface : contract Interface {function transfer(...) external}
//Bytes32 instead string cause not dynamicall data -> better performance and less gaz fee
contract ReserveMultisig {
    InterfaceStablecoin lc;
    struct proposal {
        bytes32 proposalId;
        address f;
        uint256 amount;
        address t;
        address contractAddr;
        address[] approvals;
        address[] rejects;
        bool status;
    }

    mapping(address => bool) public signers;
    mapping(bytes32 => proposal) public proposals;
    bytes32[] public allProposals;
    uint32 public limit;
    uint32 public restriction;
    uint32 public openProposals = 0;

    event addProposal(bytes32 proposalId);
    event acceptProposal(bytes32 proposalId);
    event rejectProposal(bytes32 proposalId);
    event Transfer(address _from, address _to, uint256 _amount);

    constructor(
        address[] memory _signers,
        uint32 _limit,
        uint32 _restriction
    ) public {
        for (uint256 i = 0; i < _signers.length; i++) {
            signers[_signers[i]] = true;
        }
        limit = _limit;
        restriction = _restriction;
    }

    /*###
    Verification utils
      ###*/

    modifier checkSigner() {
        require(signers[msg.sender], "01");
        _;
    }

    modifier checkNewProposal(bytes32 _proposalId) {
        require(proposals[_proposalId].proposalId != _proposalId, "02");
        _;
    }

    modifier checkProposal(bytes32 _proposalId) {
        require(proposals[_proposalId].proposalId == _proposalId, "03");
        _;
    }

    modifier checkRestriction() {
        require(restriction > openProposals, "04");
        _;
    }

    modifier checkOpen(bytes32 _proposalId) {
        require(!proposals[_proposalId].status, "05");
        _;
    }

    modifier checkAmount(uint256 _amount) {
        require(_amount > 0, "06");
        _;
    }

    modifier checkAlreadyAccept(bytes32 _proposalId) {
        bool contains = false;
        for (uint256 i = 0; i < proposals[_proposalId].approvals.length; i++) {
            if (proposals[_proposalId].approvals[i] == msg.sender) {
                contains = true;
                break;
            }
        }
        require(contains == false, "07");
        _;
    }

    function createProposal(
        uint256 _amount,
        address _contractAddr,
        address _f,
        bytes32 _proposalId,
        address _t
    )
        public
        checkSigner
        checkRestriction
        checkAmount(_amount)
        checkNewProposal(_proposalId)
    {
        proposals[_proposalId] = proposal(
            _proposalId,
            _f,
            _amount,
            _t,
            _contractAddr,
            proposals[_proposalId].approvals,
            proposals[_proposalId].rejects,
            false
        );
        proposals[_proposalId].approvals.push(msg.sender);
        allProposals.push(_proposalId);
        openProposals++;
        emit addProposal(_proposalId);
    }

    function getAllProposalsId() public view returns (bytes32[] memory) {
        return allProposals;
    }

    function getProposalById(bytes32 index)
        public
        view
        returns (
            bytes32,
            address,
            uint256,
            address,
            address,
            bool,
            address[] memory,
            address[] memory
        )
    {
        proposal memory p = proposals[index];
        return (
            p.proposalId,
            p.f,
            p.amount,
            p.t,
            p.contractAddr,
            p.status,
            p.approvals,
            p.rejects
        );
    }

    function accept(bytes32 _proposalId)
        public
        checkSigner
        checkProposal(_proposalId)
        checkOpen(_proposalId)
        checkAlreadyAccept(_proposalId)
    {
        proposals[_proposalId].approvals.push(msg.sender);
        if (proposals[_proposalId].approvals.length == limit) {
            _transfer(_proposalId);
            proposals[_proposalId].status = true;
            openProposals--;
        }
        emit acceptProposal(_proposalId);
    }

    function reject(bytes32 _proposalId)
        public
        checkSigner
        checkProposal(_proposalId)
        checkOpen(_proposalId)
    {
        proposals[_proposalId].rejects.push(msg.sender);
        for (uint256 i = 0; i < proposals[_proposalId].approvals.length; i++) {
            if (proposals[_proposalId].approvals[i] == msg.sender) {
                delete proposals[_proposalId].approvals[i]; //Delete l'élément à la position i, laissera un vide mais serait plus couteux en gaz de réindexer la liste
                break;
            }
        }
        proposals[_proposalId].status = true;
        openProposals--;
        emit rejectProposal(_proposalId);
    }

    /*
    Lugh coin transfer
    */
    function _transfer(bytes32 _proposalId) public {
        lc = InterfaceStablecoin(proposals[_proposalId].contractAddr);
        lc.transfer(
            proposals[_proposalId].amount,
            proposals[_proposalId].f,
            proposals[_proposalId].t
        );
        emit Transfer(
            proposals[_proposalId].f,
            proposals[_proposalId].t,
            proposals[_proposalId].amount
        );
    }
}
