// SPDX-License-Identifier: MIt
pragma solidity >=0.4.22 <0.8.0;
import "./InterfaceStablecoin.sol";

contract MinterMultisig {
    struct proposal {
        bytes32 proposalId;
        uint256 amount;
        bytes32 operation;
        address contractAddr;
        address[] opApprovals;
        address[] opRejects;
        address[] ctrlApprovals;
        address[] ctrlRejects;
        bool status;
    }

    InterfaceStablecoin lc;
    uint32 public limit;
    uint32 public restriction;
    uint32 public openProposals = 0;
    bytes32[] public allProposals;

    mapping(address => bool) public controllers;
    mapping(address => bool) public operators;
    mapping(bytes32 => proposal) public proposals;
    mapping(bytes32 => bool) public authOps;

    constructor(
        uint32 _limit,
        uint32 _restriction,
        address[] memory _operators,
        address[] memory _controllers
    ) public {
        for (uint256 i = 0; i < _operators.length; i++) {
            operators[_operators[i]] = true;
        }

        for (uint256 i = 0; i < _controllers.length; i++) {
            controllers[_controllers[i]] = true;
        }

        authOps["mint"] = true;
        authOps["burn"] = true;
        limit = _limit;
        restriction = _restriction;
    }

    /*###
    Verification utils
    ###*/

    modifier checkSigner() {
        require(operators[msg.sender] || controllers[msg.sender], "01");
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

    modifier checkAmount(uint256 _amount) {
        require(_amount > 0, "07");
        _;
    }

    modifier checkAlreadyAccept(bytes32 _proposalId) {
        bool contains = false;

        if (operators[msg.sender] == true) {
            // Si c'est un operateur
            // On verifie dans un premier temps si il a deja accepté
            for (
                uint256 i = 0;
                i < proposals[_proposalId].opApprovals.length;
                i++
            ) {
                if (proposals[_proposalId].opApprovals[i] == msg.sender) {
                    contains = true;
                    break;
                }
            }
        }
        if (controllers[msg.sender] == true) {
            // Si c'est un controlleur
            // On verifie si il a deja accepté
            for (
                uint256 i = 0;
                i < proposals[_proposalId].ctrlApprovals.length;
                i++
            ) {
                if (proposals[_proposalId].ctrlApprovals[i] == msg.sender) {
                    contains = true;
                    break;
                }
            }
        }

        require(contains == false, "08");
        _;
    }

    /*###
    Main entrypoints
      ###*/

    function createProposal(
        bytes32 _proposalId,
        uint256 _amount,
        bytes32 _operation,
        address _contractAddr
    )
        public
        checkSigner()
        checkOperation(_operation)
        checkRestriction()
        checkNewProposal(_proposalId)
        checkAmount(_amount)
    {
        proposals[_proposalId] = proposal(
            _proposalId,
            _amount,
            _operation,
            _contractAddr,
            proposals[_proposalId].opApprovals,
            proposals[_proposalId].opRejects,
            proposals[_proposalId].ctrlApprovals,
            proposals[_proposalId].ctrlRejects,
            false
        );

        if (operators[msg.sender] == true) {
            proposals[_proposalId].opApprovals.push(msg.sender);
        } else {
            proposals[_proposalId].ctrlApprovals.push(msg.sender);
        }
        allProposals.push(_proposalId);

        openProposals++;
    }

    function getAllProposalsId() public view returns (bytes32[] memory) {
        return allProposals;
    }

    function getProposalById(bytes32 index)
        public
        view
        returns (
            bytes32,
            uint256,
            bytes32,
            address,
            address[] memory,
            address[] memory,
            address[] memory,
            address[] memory,
            bool
        )
    {
        proposal memory p = proposals[index];
        return (
            p.proposalId,
            p.amount,
            p.operation,
            p.contractAddr,
            p.opApprovals,
            p.opRejects,
            p.ctrlApprovals,
            p.ctrlRejects,
            p.status
        );
    }

    function accept(bytes32 _proposalId)
        public
        checkSigner()
        checkProposal(_proposalId)
        checkOpen(_proposalId)
        checkAlreadyAccept(_proposalId)
    {
        if (operators[msg.sender] == true) {
            proposals[_proposalId].opApprovals.push(msg.sender);
        } else {
            // sinon c'est un ctrl
            proposals[_proposalId].ctrlApprovals.push(msg.sender);
        }

        if (
            proposals[_proposalId].opApprovals.length >= limit &&
            proposals[_proposalId].ctrlApprovals.length >= limit
        ) {
            lc = InterfaceStablecoin(proposals[_proposalId].contractAddr);
            if (proposals[_proposalId].operation == "mint") {
                lc.mint(proposals[_proposalId].amount);
            } else {
                lc.burn(proposals[_proposalId].amount);
            }
            proposals[_proposalId].status = true;
            openProposals--;
        }
    }

    function reject(bytes32 _proposalId)
        public
        checkSigner()
        checkProposal(_proposalId)
        checkOpen(_proposalId)
    {
        if (operators[msg.sender] == true) {
            proposals[_proposalId].opRejects.push(msg.sender);

            for (
                uint256 i = 0;
                i < proposals[_proposalId].opApprovals.length;
                i++
            ) {
                if (proposals[_proposalId].opApprovals[i] == msg.sender) {
                    delete proposals[_proposalId].opApprovals[i];
                    break;
                }
            }
        } else {
            // sinon c'est un ctrl
            proposals[_proposalId].ctrlRejects.push(msg.sender);

            for (
                uint256 i = 0;
                i < proposals[_proposalId].ctrlApprovals.length;
                i++
            ) {
                if (proposals[_proposalId].ctrlApprovals[i] == msg.sender) {
                    delete proposals[_proposalId].ctrlApprovals[i];
                    break;
                }
            }
        }

        proposals[_proposalId].status = true;
        openProposals--;
    }
}
