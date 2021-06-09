// SPDX-License-Identifier: MIt
pragma solidity >=0.4.22 <0.8.0;
import "./InterfaceStablecoin.sol";

contract OwnerMultisig {
    InterfaceStablecoin lc;
    struct proposal {
        bytes32 proposalId;
        address _proposalAddr;
        bytes32 operation;
        address contractAddr;
        address[] approvals;
        address[] rejects;
        bool status;
    }

    mapping(address => bool) public Signers;
    mapping(bytes32 => proposal) public Proposals;
    uint256 public openProposals;
    uint256 public restriction;
    uint256 public limit;
    mapping(bytes32 => bool) public AuthOps;
    event testSigners(address _from);
    event signedBy(address signer);
    bytes32[] public allProposals;

    constructor(
        address[] memory _signers,
        uint256 _limit,
        uint256 _restriction
    ) public {
        for (uint256 i = 0; i < _signers.length; i++) {
            Signers[_signers[i]] = true;
        }
        limit = _limit;
        restriction = _restriction;
        openProposals = 0;
        AuthOps["setMinter"] = true;
        AuthOps["setAdministrator"] = true;
        AuthOps["setReserve"] = true;
    }

    /*  Verification utils  */

    modifier checkSigner() {
        require(Signers[msg.sender], "01");
        _;
    }

    modifier checkNewProposal(bytes32 _proposalId) {
        require(Proposals[_proposalId].proposalId != _proposalId, "02");
        _;
    }

    modifier checkProposal(bytes32 _proposalId) {
        require(Proposals[_proposalId].proposalId == _proposalId, "03");
        _;
    }

    modifier checkRestriction() {
        require(restriction > openProposals, "04");
        _;
    }

    modifier checkOpen(bytes32 _proposalId) {
        require(!Proposals[_proposalId].status, "05");
        _;
    }

    modifier checkOperation(bytes32 _operation) {
        require(AuthOps[_operation], "06");
        _;
    }

    modifier checkAlreadyAccept(bytes32 _proposalId) {
        bool contains = false;

        for (uint256 i = 0; i < Proposals[_proposalId].approvals.length; i++) {
            emit testSigners(Proposals[_proposalId].approvals[i]);
            emit testSigners(msg.sender);
            if (Proposals[_proposalId].approvals[i] == msg.sender) {
                contains = true;
                break;
            }
            contains = false;
        }
        require(contains == false, "07");
        _;
    }

    /*     Main entrypoints     */

    function createProposal(
        bytes32 _proposalId,
        address _proposalAddr,
        bytes32 _operation,
        address _contractAddr
    )
        public
        checkSigner()
        checkRestriction()
        checkOperation(_operation)
        checkNewProposal(_proposalId)
    {
        Proposals[_proposalId] = proposal(
            _proposalId,
            _proposalAddr,
            _operation,
            _contractAddr,
            Proposals[_proposalId].approvals,
            Proposals[_proposalId].rejects,
            false
        );
        Proposals[_proposalId].approvals.push(msg.sender);
        allProposals.push(_proposalId);
        emit signedBy(msg.sender);
        emit signedBy(Proposals[_proposalId].approvals[0]);
        openProposals++;
    }

    function accept(bytes32 _proposalId)
        public
        checkSigner()
        checkProposal(_proposalId)
        checkOpen(_proposalId)
        checkAlreadyAccept(_proposalId)
    {
        Proposals[_proposalId].approvals.push(msg.sender);
        emit signedBy(Proposals[_proposalId].approvals[1]);
        if (Proposals[_proposalId].approvals.length == limit) {
            lc = InterfaceStablecoin(Proposals[_proposalId].contractAddr);
            if (Proposals[_proposalId].operation == "setMinter") {
                lc.setMinter(Proposals[_proposalId]._proposalAddr);
            } else if (Proposals[_proposalId].operation == "setAdministrator") {
                lc.setAdministrator(Proposals[_proposalId]._proposalAddr);
            } else if (Proposals[_proposalId].operation == "setReserve") {
                lc.setReserve(Proposals[_proposalId]._proposalAddr);
            }
            Proposals[_proposalId].status = true;
            openProposals--;
        }
    }

    function reject(bytes32 _proposalId)
        public
        checkSigner()
        checkProposal(_proposalId)
        checkOpen(_proposalId)
    {
        Proposals[_proposalId].rejects.push(msg.sender);
        for (uint256 i = 0; i < Proposals[_proposalId].approvals.length; i++) {
            if (Proposals[_proposalId].approvals[i] == msg.sender) {
                delete Proposals[_proposalId].approvals[i];
                break;
            }
        }
        Proposals[_proposalId].status = true;
        openProposals--;
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
            bytes32,
            address,
            address[] memory,
            address[] memory,
            bool
        )
    {
        proposal memory p = Proposals[index];
        return (
            p.proposalId,
            p._proposalAddr,
            p.operation,
            p.contractAddr,
            p.approvals,
            p.rejects,
            p.status
        );
    }
}
