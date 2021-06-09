//SPDX-License-Identifier: MITC
pragma solidity >=0.4.22 <0.8.0;
import "./InterfaceStablecoin.sol";

contract AdminMultisig {
    InterfaceStablecoin lc;
    struct proposal {
        bytes32 proposalId;
        address f;
        uint256 amount;
        address t;
        bool state;
        bytes32 operation;
        address contractAddr;
        address[] approvals;
        address[] rejects;
        bool status;
    }
    mapping(bytes32 => proposal) public proposals;
    uint32 public limit;
    uint32 public openProposals;
    uint32 public restriction;
    mapping(bytes32 => bool) public authOps;
    mapping(address => bool) public signers;
    event addProposal(bytes32 proposalId);
    event acceptProposal(bytes32 proposalId);
    bytes32[] public allProposals;

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
        openProposals = 0;
        authOps["setLock"] = true;
        authOps["setWhiteListing"] = true;
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

    modifier checkOperation(bytes32 _operation) {
        require(authOps[_operation], "06");
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

    function createAddressProposal(
        bytes32 _operation,
        bytes32 _proposalId,
        address _to,
        bool _state,
        address _contractAddress
    )
        public
        checkSigner()
        checkOperation(_operation)
        checkRestriction()
        checkNewProposal(_proposalId)
    {
        proposals[_proposalId] = proposal(
            _proposalId,
            msg.sender,
            0,
            _to,
            _state,
            _operation,
            _contractAddress,
            proposals[_proposalId].approvals,
            proposals[_proposalId].rejects,
            false
        );
        proposals[_proposalId].approvals.push(msg.sender);
        openProposals++;
        allProposals.push(_proposalId);
        emit addProposal(_proposalId);
    }

    function createPauseProposal(
        bytes32 _proposalId,
        address _to,
        bool _state,
        address _contractAddress
    ) public checkSigner() checkRestriction() checkNewProposal(_proposalId) {
        proposals[_proposalId] = proposal(
            _proposalId,
            msg.sender,
            0,
            _to,
            _state,
            "setPause",
            _contractAddress,
            proposals[_proposalId].approvals,
            proposals[_proposalId].rejects,
            false
        );
        proposals[_proposalId].approvals.push(msg.sender);
        allProposals.push(_proposalId);
        openProposals++;
        emit addProposal(_proposalId);
    }

    function createTransferProposal(
        bytes32 _proposalId,
        uint256 _amount,
        address _to,
        address _from,
        bool _state,
        address _contractAddress
    ) public checkSigner() checkRestriction() checkNewProposal(_proposalId) {
        require(_amount > 0, "07");
        proposals[_proposalId] = proposal(
            _proposalId,
            _from,
            _amount,
            _to,
            _state,
            "transfer",
            _contractAddress,
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
            bool,
            bytes32,
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
            p.state,
            p.operation,
            p.contractAddr,
            p.status,
            p.approvals,
            p.rejects
        );
    }

    function accept(bytes32 _proposalId)
        public
        checkSigner()
        checkProposal(_proposalId)
        checkOpen(_proposalId)
        checkAlreadyAccept(_proposalId)
    {
        proposals[_proposalId].approvals.push(msg.sender);
        if (proposals[_proposalId].approvals.length == limit) {
            lc = InterfaceStablecoin(proposals[_proposalId].contractAddr);
            if (proposals[_proposalId].operation == "setWhiteListing") {
                lc.setWhitelist(
                    proposals[_proposalId].t,
                    proposals[_proposalId].state
                );
            } else if (proposals[_proposalId].operation == "setLock") {
                lc.setLock(
                    proposals[_proposalId].t,
                    proposals[_proposalId].state
                );
            } else if (proposals[_proposalId].operation == "transfer") {
                lc.transfer(
                    proposals[_proposalId].amount,
                    proposals[_proposalId].f,
                    proposals[_proposalId].t
                );
            } else {
                lc.setPause(proposals[_proposalId].state);
            }
            proposals[_proposalId].status = true;
            openProposals--;
            emit acceptProposal(_proposalId);
        }
    }

    function reject(bytes32 _proposalId)
        public
        checkSigner()
        checkProposal(_proposalId)
        checkOpen(_proposalId)
    {
        proposals[_proposalId].rejects.push(msg.sender);
        for (uint256 i = 0; i < proposals[_proposalId].approvals.length; i++) {
            if (proposals[_proposalId].approvals[i] == msg.sender) {
                delete proposals[_proposalId].approvals[i];
                break;
            }
        }
        proposals[_proposalId].status = true;
        openProposals--;
    }
}
