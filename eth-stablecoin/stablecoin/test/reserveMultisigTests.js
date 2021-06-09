const reserveMultisig = artifacts.require('ReserveMultisig.sol')
const adminMultisig = artifacts.require('AdminMultisig.sol')
const stableCoin = artifacts.require('Stablecoin.sol')

const tryCatch = require("./exceptions.js").tryCatch;
const errTypes = require("./exceptions.js").errTypes;
const errCodes = require("./exceptions.js").errCodesReserve;

contract('Testing Reserve Multisig contract', function (accounts) {

    const firstSigner = accounts[0]
    const secondSigner = accounts[1]
    const thirdSigner = accounts[2]
    const alice = accounts[3]
    const reserve = accounts[6]
    const admin = accounts[7]
    const minter = accounts[8];
    const owner = accounts[5];

    // Setup before each test
    beforeEach('setup contract for each test', async function () {
        // Deploying contract
        // owner = firstsigner
        // minter = minter
        AdminContract = await adminMultisig.new([firstSigner, secondSigner, thirdSigner], 2, 40, { from: firstSigner })
        ReserveContract = await reserveMultisig.new([firstSigner,secondSigner,thirdSigner],2,40,{from: firstSigner})
        StableCoin = await stableCoin.new(admin, minter, owner, { from: firstSigner })
        contractAddr = StableCoin.address
        reserveAddr = ReserveContract.address
        //white list alice  to be able to receive some stableCoins
        await StableCoin.setWhitelist(alice,true, {from:admin});
        await StableCoin.setReserve(ReserveContract.address, {from : owner});
        await StableCoin.mint(600000, {from: minter});
        assert.equal((await StableCoin.balances(ReserveContract.address)).balance,600000);
    })
    it('#r01 - firstSigner creates a proposal', async function (){
        // First signer creates a new proposal
        // function createProposal(uint256 _amount, address _contractAddr, address _f, bytes32 _proposalId, address _t) 
        await ReserveContract.createProposal(20000, contractAddr, reserve, web3.utils.fromAscii("rt01"), alice, {from: firstSigner});

        // Retrieving newly created proposal info
        retrievedProposalInfo = await ReserveContract.proposals(web3.utils.fromAscii("rt01"));

        // Checking the arguments of the proposal 
        assert.equal(retrievedProposalInfo.amount, 20000);
        assert.equal(retrievedProposalInfo.contractAddr, contractAddr);
        assert.equal(retrievedProposalInfo.f, reserve);
        assert.equal(retrievedProposalInfo.t, alice);

        // Check the number of proposals open, should be equal to 1
        const nbrProposals = await ReserveContract.openProposals();
        assert.equal(nbrProposals, 1);
    })
    it('#r02 - firstSigner accepts proposal', async function () {
        // First signer creates a new proposal
        // function createProposal(uint256 _amount, address _contractAddr, address _f, bytes32 _proposalId, address _t) 
        const propositionId = "rt01";
        await ReserveContract.createProposal(20000, contractAddr, reserve, web3.utils.fromAscii(propositionId), alice, {from: firstSigner});
        
        // Check the number of proposals open, should be equal to 1
        const nbrProposals = await ReserveContract.openProposals();
        assert.equal(nbrProposals, 1);

        // firstSigner try to accepts the proposal.
        // function accept(bytes32 _proposalId)
        await tryCatch(ReserveContract.accept(web3.utils.fromAscii(propositionId), {from: firstSigner}), errTypes.revert, errCodes.proposalAlreadyAccepted);
    })
    it('#r03 - secondSigner rejects proposal', async function () {
        // First signer creates a new proposal
        // function createProposal(uint256 _amount, address _contractAddr, address _f, bytes32 _proposalId, address _t) 
        const propositionId = "rt01";
        await ReserveContract.createProposal(20000, contractAddr, reserve, web3.utils.fromAscii(propositionId), alice, {from: firstSigner});
        
        // Check the number of proposals open, should be equal to 1
        let nbrProposals = await ReserveContract.openProposals();
        assert.equal(nbrProposals, 1);

        // secondSigner rejects proposal
        await ReserveContract.reject(web3.utils.fromAscii(propositionId), {from: secondSigner});

        // Check the number of proposals open, should be equal to 0
        nbrProposals = await ReserveContract.openProposals();
        assert.equal(nbrProposals, 0);

        // Retrieving modified proposal info
        retrievedProposalInfo = await ReserveContract.proposals(web3.utils.fromAscii(propositionId));

        // Checking the arguments of the proposal 
        assert.equal(retrievedProposalInfo.amount, 20000);
        assert.equal(retrievedProposalInfo.contractAddr, contractAddr);
        assert.equal(retrievedProposalInfo.f, reserve);
        assert.equal(retrievedProposalInfo.t, alice);
        assert.equal(retrievedProposalInfo.status, true);
    })
    it('#r04 - thirdSigner accepts proposal', async function () {
        // First signer creates a new proposal
        // function createProposal(uint256 _amount, address _contractAddr, address _f, bytes32 _proposalId, address _t) 
        const propositionId = "rt01";
        await ReserveContract.createProposal(20000, contractAddr, reserve, web3.utils.fromAscii(propositionId), alice, {from: firstSigner});
        
        // Check the number of proposals open, should be equal to 1
        let nbrProposals = await ReserveContract.openProposals();
        assert.equal(nbrProposals, 1);

        // secondSigner rejets proposal
        await ReserveContract.reject(web3.utils.fromAscii(propositionId), {from: secondSigner});

        // Check the number of proposals open, should be equal to 0
        nbrProposals = await ReserveContract.openProposals();
        assert.equal(nbrProposals, 0);

        // Retrieving modified proposal info
        const retrievedProposalInfo = await ReserveContract.proposals(web3.utils.fromAscii(propositionId));

        // Checking the arguments of the proposal 
        assert.equal(retrievedProposalInfo.amount, 20000);
        assert.equal(retrievedProposalInfo.contractAddr, contractAddr);
        assert.equal(retrievedProposalInfo.f, reserve);
        assert.equal(retrievedProposalInfo.t, alice);
        assert.equal(retrievedProposalInfo.status, true);

        // thirdSigner tries to accepts proposal
        await tryCatch(ReserveContract.accept(web3.utils.fromAscii(propositionId), {from: thirdSigner}), errTypes.revert, errCodes.proposalAlreadyClosed);
    })
    it('#r05 - thirdSigner tries to create a proposal', async function () {
        // First signer creates a new proposal
        // function createProposal(uint256 _amount, address _contractAddr, address _f, bytes32 _proposalId, address _t) 
        const propositionId = "rt01";
        await ReserveContract.createProposal(20000, contractAddr, reserve, web3.utils.fromAscii(propositionId), alice, {from: firstSigner});
        
        // Check the number of proposals open, should be equal to 1
        let nbrProposals = await ReserveContract.openProposals();
        assert.equal(nbrProposals, 1);

        // thirdSigner trries to create a proposal
        await tryCatch(ReserveContract.createProposal(20000, contractAddr, reserve, web3.utils.fromAscii(propositionId), alice, {from: thirdSigner}), errTypes.revert, errCodes.proposalIdAlreadyReferenced);
    })
    it('#r06 - thirdSigner creates a proposal', async function () {
         // First signer creates a new proposal
        // function createProposal(uint256 _amount, address _contractAddr, address _f, bytes32 _proposalId, address _t) 
        const propositionId1 = "rt01";
        const propositionId2 = "rt02";
        await ReserveContract.createProposal(20000, contractAddr, reserve, web3.utils.fromAscii(propositionId1), alice, {from: firstSigner});
        
        // Check the number of proposals open, should be equal to 1
        let nbrProposals = await ReserveContract.openProposals();
        assert.equal(nbrProposals, 1);

        // secondSigner rejets proposal
        await ReserveContract.reject(web3.utils.fromAscii(propositionId1), {from: secondSigner});

        // Third signer creates a new proposal
        // function createProposal(uint256 _amount, address _contractAddr, address _f, bytes32 _proposalId, address _t) 
        await ReserveContract.createProposal(20000, contractAddr, reserve, web3.utils.fromAscii(propositionId2), alice, {from: thirdSigner});
        
        // Check the number of proposals open, should be equal to 1
        nbrProposals = await ReserveContract.openProposals();
        assert.equal(nbrProposals, 1);

        const retrievedProposalInfo1 = await ReserveContract.proposals(web3.utils.fromAscii(propositionId1));
        const retrievedProposalInfo2 = await ReserveContract.proposals(web3.utils.fromAscii(propositionId2));
        assert.equal(retrievedProposalInfo1.status, true);
        assert.equal(retrievedProposalInfo2.status, false);
    })
    it('#r07 - secondSigner accepts proposal', async function () {
        // First signer creates a new proposal
        // function createProposal(uint256 _amount, address _contractAddr, address _f, bytes32 _proposalId, address _t) 
        const propositionId1 = "rt01";
        const propositionId2 = "rt02";
        await ReserveContract.createProposal(20000, contractAddr, reserveAddr, web3.utils.fromAscii(propositionId1), alice, {from: firstSigner});
        
        // Check the number of proposals open, should be equal to 1
        let nbrProposals = await ReserveContract.openProposals();
        assert.equal(nbrProposals, 1);

        // secondSigner rejets proposal
        await ReserveContract.reject(web3.utils.fromAscii(propositionId1), {from: secondSigner});

        // Third signer creates a new proposal
        // function createProposal(uint256 _amount, address _contractAddr, address _f, bytes32 _proposalId, address _t) 
        await ReserveContract.createProposal(20000, contractAddr, reserveAddr, web3.utils.fromAscii(propositionId2), alice, {from: thirdSigner});
        
        // Check the number of proposals open, should be equal to 1
        nbrProposals = await ReserveContract.openProposals();
        assert.equal(nbrProposals, 1);
        
         // Second signer accept proposal
         await ReserveContract.accept(web3.utils.fromAscii(propositionId2), {from: secondSigner});

         //Check if Alice got 20000 stablecoins
         assert.equal((await StableCoin.balances(alice)).balance, 20000);

        const retrievedProposalInfo1 = await ReserveContract.proposals(web3.utils.fromAscii(propositionId1));
        const retrievedProposalInfo2 = await ReserveContract.proposals(web3.utils.fromAscii(propositionId2));
        assert.equal(retrievedProposalInfo1.status, true);
        assert.equal(retrievedProposalInfo2.status, true);
    })
    it('#r08 - firstSigner accepts proposal', async function () {
        // First signer creates a new proposal
        // function createProposal(uint256 _amount, address _contractAddr, address _f, bytes32 _proposalId, address _t) 
        const propositionId1 = "rt01";
        const propositionId2 = "rt02";
        await ReserveContract.createProposal(20000, contractAddr, reserveAddr, web3.utils.fromAscii(propositionId1), alice, {from: firstSigner});
        
        // Check the number of proposals open, should be equal to 1
        let nbrProposals = await ReserveContract.openProposals();
        assert.equal(nbrProposals, 1);

        // secondSigner rejets proposal
        await ReserveContract.reject(web3.utils.fromAscii(propositionId1), {from: secondSigner});

        // Third signer creates a new proposal
        // function createProposal(uint256 _amount, address _contractAddr, address _f, bytes32 _proposalId, address _t) 
        await ReserveContract.createProposal(20000, contractAddr, reserveAddr, web3.utils.fromAscii(propositionId2), alice, {from: thirdSigner});
        
        // Check the number of proposals open, should be equal to 1
        nbrProposals = await ReserveContract.openProposals();
        assert.equal(nbrProposals, 1);

        // Second signer accept proposal
        await ReserveContract.accept(web3.utils.fromAscii(propositionId2), {from: secondSigner});

        //Check if Alice got 20000 stablecoins
        assert.equal((await StableCoin.balances(alice)).balance, 20000);

        // Check the number of proposals open, should be equal to 0
        nbrProposals = await ReserveContract.openProposals();
        assert.equal(nbrProposals, 0);

        // First signer tries to accept proposal
        await tryCatch(ReserveContract.accept(web3.utils.fromAscii(propositionId2), {from: firstSigner}), errTypes.revert, errCodes.proposalAlreadyClosed);
    })
    it('#r09 - firstSigner creates a  proposal', async function () {
        // First signer creates a new proposal
        // function createProposal(uint256 _amount, address _contractAddr, address _f, bytes32 _proposalId, address _t) 
        const propositionId1 = "rt01";
        const propositionId2 = "rt02";
        const propositionId3 = "rt03";
        await ReserveContract.createProposal(20000, contractAddr, reserveAddr, web3.utils.fromAscii(propositionId1), alice, {from: firstSigner});
        
        // Check the number of proposals open, should be equal to 1
        let nbrProposals = await ReserveContract.openProposals();
        assert.equal(nbrProposals, 1);

        // secondSigner rejets proposal
        await ReserveContract.reject(web3.utils.fromAscii(propositionId1), {from: secondSigner});

        // Third signer creates a new proposal
        // function createProposal(uint256 _amount, address _contractAddr, address _f, bytes32 _proposalId, address _t) 
        await ReserveContract.createProposal(20000, contractAddr, reserveAddr, web3.utils.fromAscii(propositionId2), alice, {from: thirdSigner});
        
        // Check the number of proposals open, should be equal to 1
        nbrProposals = await ReserveContract.openProposals();
        assert.equal(nbrProposals, 1);

        // Second signer accept proposal
        await ReserveContract.accept(web3.utils.fromAscii(propositionId2), {from: secondSigner});
        //Check if Alice got 20000 stablecoins
        assert.equal((await StableCoin.balances(alice)).balance, 20000);

        // Check the number of proposals open, should be equal to 0
        nbrProposals = await ReserveContract.openProposals();
        assert.equal(nbrProposals, 0);

        // First signer create a new proposal
        await ReserveContract.createProposal(20000, contractAddr, reserveAddr, web3.utils.fromAscii(propositionId3), alice, {from: firstSigner});

        // Check status of retrived proposals
        const retrievedProposalInfo1 = await ReserveContract.proposals(web3.utils.fromAscii(propositionId1));
        const retrievedProposalInfo2 = await ReserveContract.proposals(web3.utils.fromAscii(propositionId2));
        const retrievedProposalInfo3 = await ReserveContract.proposals(web3.utils.fromAscii(propositionId3));
        assert.equal(retrievedProposalInfo1.status, true);
        assert.equal(retrievedProposalInfo2.status, true);
        assert.equal(retrievedProposalInfo3.status, false);
    })
    it('#r10 - secondSigner rejects proposal', async function () {
        // First signer creates a new proposal
        // function createProposal(uint256 _amount, address _contractAddr, address _f, bytes32 _proposalId, address _t) 
        const propositionId1 = "rt01";
        const propositionId2 = "rt02";
        const propositionId3 = "rt03";
        await ReserveContract.createProposal(20000, contractAddr, reserveAddr, web3.utils.fromAscii(propositionId1), alice, {from: firstSigner});
        
        // Check the number of proposals open, should be equal to 1
        let nbrProposals = await ReserveContract.openProposals();
        assert.equal(nbrProposals, 1);

        // secondSigner rejets proposal
        await ReserveContract.reject(web3.utils.fromAscii(propositionId1), {from: secondSigner});

        // Third signer creates a new proposal
        // function createProposal(uint256 _amount, address _contractAddr, address _f, bytes32 _proposalId, address _t) 
        await ReserveContract.createProposal(20000, contractAddr, reserveAddr, web3.utils.fromAscii(propositionId2), alice, {from: thirdSigner});
        
        // Check the number of proposals open, should be equal to 1
        nbrProposals = await ReserveContract.openProposals();
        assert.equal(nbrProposals, 1);

        // Second signer accept proposal
        await ReserveContract.accept(web3.utils.fromAscii(propositionId2), {from: secondSigner});

        //Check if Alice got 20000 stablecoins
        assert.equal((await StableCoin.balances(alice)).balance, 20000);

        // Check the number of proposals open, should be equal to 0
        nbrProposals = await ReserveContract.openProposals();
        assert.equal(nbrProposals, 0);

        // First signer create a new proposal
        await ReserveContract.createProposal(20000, contractAddr, reserveAddr, web3.utils.fromAscii(propositionId3), alice, {from: firstSigner});

         // secondSigner rejets proposal
         await ReserveContract.reject(web3.utils.fromAscii(propositionId3), {from: secondSigner});

        // Check status of retrived proposals
        const retrievedProposalInfo1 = await ReserveContract.proposals(web3.utils.fromAscii(propositionId1));
        const retrievedProposalInfo2 = await ReserveContract.proposals(web3.utils.fromAscii(propositionId2));
        const retrievedProposalInfo3 = await ReserveContract.proposals(web3.utils.fromAscii(propositionId3));
        assert.equal(retrievedProposalInfo1.status, true);
        assert.equal(retrievedProposalInfo2.status, true);
        assert.equal(retrievedProposalInfo3.status, true);
    })
    it('#r11 - firstSigner rejects proposal', async function () {
        // First signer creates a new proposal
        // function createProposal(uint256 _amount, address _contractAddr, address _f, bytes32 _proposalId, address _t) 
        const propositionId1 = "rt01";
        const propositionId2 = "rt02";
        const propositionId3 = "rt03";
        await ReserveContract.createProposal(20000, contractAddr, reserveAddr, web3.utils.fromAscii(propositionId1), alice, {from: firstSigner});
        
        // Check the number of proposals open, should be equal to 1
        let nbrProposals = await ReserveContract.openProposals();
        assert.equal(nbrProposals, 1);

        // secondSigner rejets proposal
        await ReserveContract.reject(web3.utils.fromAscii(propositionId1), {from: secondSigner});

        // Third signer creates a new proposal
        // function createProposal(uint256 _amount, address _contractAddr, address _f, bytes32 _proposalId, address _t) 
        await ReserveContract.createProposal(20000, contractAddr, reserveAddr, web3.utils.fromAscii(propositionId2), alice, {from: thirdSigner});
        
        // Check the number of proposals open, should be equal to 1
        nbrProposals = await ReserveContract.openProposals();
        assert.equal(nbrProposals, 1);

        // Second signer accept proposal
        await ReserveContract.accept(web3.utils.fromAscii(propositionId2), {from: secondSigner});

        //Check if Alice got 20000 stablecoins
        assert.equal((await StableCoin.balances(alice)).balance, 20000);

        // Check the number of proposals open, should be equal to 0
        nbrProposals = await ReserveContract.openProposals();
        assert.equal(nbrProposals, 0);

        // First signer create a new proposal
        await ReserveContract.createProposal(20000, contractAddr, reserveAddr, web3.utils.fromAscii(propositionId3), alice, {from: firstSigner});

         // secondSigner rejets proposal
         await ReserveContract.reject(web3.utils.fromAscii(propositionId3), {from: secondSigner});

        // firstSigner tries reject proposal
        await tryCatch(ReserveContract.reject(web3.utils.fromAscii(propositionId3), {from: firstSigner}), errTypes.revert, errCodes.proposalAlreadyClosed);
    })
    it('#r12 - firstSigner creates a proposal for over transfering', async function () {
        // First signer creates a new proposal
        // function createProposal(uint256 _amount, address _contractAddr, address _f, bytes32 _proposalId, address _t) 
        const propositionId1 = "rt01";
        const propositionId2 = "rt02";
        const propositionId3 = "rt03";
        const propositionId4 = "rt04";
        await ReserveContract.createProposal(20000, contractAddr, reserveAddr, web3.utils.fromAscii(propositionId1), alice, {from: firstSigner});
        
        // Check the number of proposals open, should be equal to 1
        let nbrProposals = await ReserveContract.openProposals();
        assert.equal(nbrProposals, 1);

        // secondSigner rejets proposal
        await ReserveContract.reject(web3.utils.fromAscii(propositionId1), {from: secondSigner});

        // Third signer creates a new proposal
        // function createProposal(uint256 _amount, address _contractAddr, address _f, bytes32 _proposalId, address _t) 
        await ReserveContract.createProposal(20000, contractAddr, reserveAddr, web3.utils.fromAscii(propositionId2), alice, {from: thirdSigner});
        
        // Check the number of proposals open, should be equal to 1
        nbrProposals = await ReserveContract.openProposals();
        assert.equal(nbrProposals, 1);

        // Second signer accept proposal
        await ReserveContract.accept(web3.utils.fromAscii(propositionId2), {from: secondSigner});

        //Check if Alice got 20000 stablecoins
        assert.equal((await StableCoin.balances(alice)).balance, 20000);

        // Check the number of proposals open, should be equal to 0
        nbrProposals = await ReserveContract.openProposals();
        assert.equal(nbrProposals, 0);

        // First signer create a new proposal
        await ReserveContract.createProposal(20000, contractAddr, reserveAddr, web3.utils.fromAscii(propositionId3), alice, {from: firstSigner});

         // secondSigner rejets proposal
        await ReserveContract.reject(web3.utils.fromAscii(propositionId3), {from: secondSigner});

       // First signer create a new proposal
         await ReserveContract.createProposal(20000, contractAddr, reserveAddr, web3.utils.fromAscii(propositionId4), alice, {from: firstSigner});

       // Check status of retrived proposals
       const retrievedProposalInfo1 = await ReserveContract.proposals(web3.utils.fromAscii(propositionId1));
       const retrievedProposalInfo2 = await ReserveContract.proposals(web3.utils.fromAscii(propositionId2));
       const retrievedProposalInfo3 = await ReserveContract.proposals(web3.utils.fromAscii(propositionId3));
       const retrievedProposalInfo4 = await ReserveContract.proposals(web3.utils.fromAscii(propositionId4));
       assert.equal(retrievedProposalInfo1.status, true);
       assert.equal(retrievedProposalInfo2.status, true);
       assert.equal(retrievedProposalInfo3.status, true);
       assert.equal(retrievedProposalInfo4.status, false);
    })
    it('#r13 - secondSigner accept proposal', async function () {
        // First signer creates a new proposal
        // function createProposal(uint256 _amount, address _contractAddr, address _f, bytes32 _proposalId, address _t) 
        const propositionId1 = "rt01";
        const propositionId2 = "rt02";
        const propositionId3 = "rt03";
        const propositionId4 = "rt04";
        await ReserveContract.createProposal(20000, contractAddr, reserveAddr, web3.utils.fromAscii(propositionId1), alice, {from: firstSigner});
        
        // Check the number of proposals open, should be equal to 1
        let nbrProposals = await ReserveContract.openProposals();
        assert.equal(nbrProposals, 1);

        // secondSigner rejets proposal
        await ReserveContract.reject(web3.utils.fromAscii(propositionId1), {from: secondSigner});

        // Third signer creates a new proposal
        // function createProposal(uint256 _amount, address _contractAddr, address _f, bytes32 _proposalId, address _t) 
        await ReserveContract.createProposal(20000, contractAddr, reserveAddr, web3.utils.fromAscii(propositionId2), alice, {from: thirdSigner});
        
        // Check the number of proposals open, should be equal to 1
        nbrProposals = await ReserveContract.openProposals();
        assert.equal(nbrProposals, 1);

        // secondSigner rejets proposal
        await ReserveContract.reject(web3.utils.fromAscii(propositionId2), {from: secondSigner});

        // Check the number of proposals open, should be equal to 0
        nbrProposals = await ReserveContract.openProposals();
        assert.equal(nbrProposals, 0);

        // First signer create a new proposal
        await ReserveContract.createProposal(20000, contractAddr, reserveAddr, web3.utils.fromAscii(propositionId3), alice, {from: firstSigner});

         // secondSigner rejets proposal
        await ReserveContract.reject(web3.utils.fromAscii(propositionId3), {from: secondSigner});

       // First signer create a new proposal
       await ReserveContract.createProposal(20000, contractAddr, reserveAddr, web3.utils.fromAscii(propositionId4), alice, {from: firstSigner});

        // Second signer accept proposal
        await ReserveContract.accept(web3.utils.fromAscii(propositionId4), {from: secondSigner})
        //Check if Alice got 20000 stablecoins
        assert.equal((await StableCoin.balances(alice)).balance, 20000);

       // Check status of retrived proposals
       const retrievedProposalInfo1 = await ReserveContract.proposals(web3.utils.fromAscii(propositionId1));
       const retrievedProposalInfo2 = await ReserveContract.proposals(web3.utils.fromAscii(propositionId2));
       const retrievedProposalInfo3 = await ReserveContract.proposals(web3.utils.fromAscii(propositionId3));
       const retrievedProposalInfo4 = await ReserveContract.proposals(web3.utils.fromAscii(propositionId4));
       assert.equal(retrievedProposalInfo1.status, true);
       assert.equal(retrievedProposalInfo2.status, true);
       assert.equal(retrievedProposalInfo3.status, true);
       assert.equal(retrievedProposalInfo4.status, true);
    })
    it("#r14 - firstSigner creates null transfer", async function () {
        // First signer creates a new proposal
        // function createProposal(uint256 _amount, address _contractAddr, address _f, bytes32 _proposalId, address _t) 
        const propositionId1 = "rt01";
        await tryCatch(ReserveContract.createProposal(0, contractAddr, reserve, web3.utils.fromAscii(propositionId1), alice, {from: firstSigner}),errTypes.revert, errCodes.transferAmountNotPermitted);
    })
})
