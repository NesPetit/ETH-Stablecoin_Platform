const minterMultisig = artifacts.require('MinterMultisig')
const stableCoin = artifacts.require('Stablecoin.sol')


let tryCatch = require("./exceptions.js").tryCatch;
let errTypes = require("./exceptions.js").errTypes;
let errCodes = require("./exceptions.js").errCodesMinter;

contract('Testing Minter Multisig contract', function (accounts) {

    const opFirstSigner = accounts[0];
    const opSecondSigner = accounts[1];
    const ctrlFirstSigner = accounts[2];
    const ctrlSecondSigner = accounts[3];
    const owner = accounts[4];

    // Setup before each test
    beforeEach('setup contract for each test', async function () {
        // Deploying contract
        // Minter contract constructor(uint32 _limit, uint32 _restriction, address[] memory _operators, address[] memory _controllers)
        MinterContract = await minterMultisig.new(1,10,[opFirstSigner,opSecondSigner],[ctrlFirstSigner,ctrlSecondSigner], {from: accounts[0]});
        StableCoin = await stableCoin.new(accounts[0], MinterContract.address, owner, { from: accounts[0] })
        contractAddr = StableCoin.address
    })

    it('#m00 - check status', async function (){
        await MinterContract.createProposal(web3.utils.fromAscii("mm01"), 1000, web3.utils.fromAscii("mint"), contractAddr, {from: opFirstSigner});
        await MinterContract.accept(web3.utils.fromAscii("mm01"), {from: ctrlFirstSigner});
        let proposition = await MinterContract.proposals(web3.utils.fromAscii("mm01"))
        assert.equal(proposition.status, true)
        assert.equal(await MinterContract.openProposals(), 0)
    })

    it('#m01 - opFirstSigner tries to create a transfer proposal', async function (){
        // function createProposal(bytes32 _proposalId, uint256 _amount, bytes32 _operation, address _contractAddr)
        await tryCatch(MinterContract.createProposal(web3.utils.fromAscii("mm01"), 1000, web3.utils.fromAscii("transfer"), contractAddr, {from: opFirstSigner}), errTypes.revert, errCodes.invalidOperation);
    })

    it('#m02 - opFirstSigner creates a mint proposal', async function (){
        // function createProposal(bytes32 _proposalId, uint256 _amount, bytes32 _operation, address _contractAddr)
        await MinterContract.createProposal(web3.utils.fromAscii("mm01"), 1000, web3.utils.fromAscii("mint"), contractAddr, {from: opFirstSigner});
    })

    it('#m03 - opFirstSigner accepts proposal', async function (){
        // create proposal
        await MinterContract.createProposal(web3.utils.fromAscii("mm01"), 1000, web3.utils.fromAscii("mint"), contractAddr, {from: opFirstSigner});
        // Verify openProposals = 1
        assert.equal(await MinterContract.openProposals(), 1)
        // double signature test op
        await tryCatch(MinterContract.accept(web3.utils.fromAscii("mm01"), {from: opFirstSigner}), errTypes.revert, errCodes.alreadyAccept);
    })

    it('#m04 - ctrlSecondSigner accepts unreferenced proposalId', async function (){
        // create proposal by ctrlFirstSigner
        await MinterContract.createProposal(web3.utils.fromAscii("mm01"), 1000, web3.utils.fromAscii("mint"), contractAddr, {from: ctrlFirstSigner});
        // Verify openProposals = 1
        assert.equal(await MinterContract.openProposals(), 1)
        // ctrlSecondSigner accept test
        await tryCatch(MinterContract.accept(web3.utils.fromAscii("mm02"), {from: ctrlSecondSigner}), errTypes.revert, errCodes.invalidProposalId);
    })

    it('#m05 - opSecondSigner accepts proposal', async function (){
        // create proposal by opFirstSigner
        await MinterContract.createProposal(web3.utils.fromAscii("mm01"), 1000, web3.utils.fromAscii("mint"), contractAddr, {from: opFirstSigner});
        // opSecondSigner accept test
        await MinterContract.accept(web3.utils.fromAscii("mm01"), {from: opSecondSigner});
    })

    it('#m06 - ctrlSecondSigner accepts proposal', async function (){
        // create proposal by opFirstSigner
        await MinterContract.createProposal(web3.utils.fromAscii("mm01"), 1000, web3.utils.fromAscii("mint"), contractAddr, {from: opFirstSigner});
        // accept opSecondSigner
        await MinterContract.accept(web3.utils.fromAscii("mm01"), {from: opSecondSigner});
        // ctrlSecondSigner accept test
        await MinterContract.accept(web3.utils.fromAscii("mm01"), {from: ctrlSecondSigner});
    })

    it('#m07 - ctrlFirstSigner accepts proposal', async function (){
        // create proposal
        await MinterContract.createProposal(web3.utils.fromAscii("mm01"), 1000, web3.utils.fromAscii("mint"), contractAddr, {from: ctrlFirstSigner});
        // Verify openProposals = 1
        assert.equal(await MinterContract.openProposals(), 1)
        // opFirstSigner accepts and close proposal
        await MinterContract.accept(web3.utils.fromAscii("mm01"), {from: opFirstSigner});
        // Verify openProposals = 0 and status = true
        assert.equal(await MinterContract.openProposals(), 0)
        // double signature test ctrl
        await tryCatch(MinterContract.accept(web3.utils.fromAscii("mm01"), {from: ctrlFirstSigner}), errTypes.revert, errCodes.closedProposal);
    })

    it('#m08 - opSecondSigner creates a burn proposal with referenced proposalId', async function (){
        // create proposal
        await MinterContract.createProposal(web3.utils.fromAscii("mb01"), 200, web3.utils.fromAscii("burn"), contractAddr, {from: opFirstSigner});
        // create new proposal with same id
        await tryCatch(MinterContract.createProposal(web3.utils.fromAscii("mb01"), 200, web3.utils.fromAscii("burn"), contractAddr, {from: opSecondSigner}), errTypes.revert, errCodes.proposalIdAlreadyInContract);
    })

    it('#m09 - opSecondSigner creates a burn proposal with referenced proposalId', async function (){
        // function createProposal(bytes32 _proposalId, uint256 _amount, bytes32 _operation, address _contractAddr)
        await MinterContract.createProposal(web3.utils.fromAscii("mb01"), 200, web3.utils.fromAscii("burn"), contractAddr, {from: opSecondSigner});
    })

    it('#m10 - opSecondSigner rejects burn proposal', async function (){
        // create proposal
        await MinterContract.createProposal(web3.utils.fromAscii("mb01"), 200, web3.utils.fromAscii("burn"), contractAddr, {from: opSecondSigner});
        // function reject(bytes32 _proposalId)
        await MinterContract.reject(web3.utils.fromAscii("mb01"), {from: opSecondSigner});
    })

    it('#m11 - opFirstSigner rejects proposal', async function (){
        // open and close proposal
        await MinterContract.createProposal(web3.utils.fromAscii("mb01"), 200, web3.utils.fromAscii("burn"), contractAddr, {from: ctrlFirstSigner});
        await MinterContract.reject(web3.utils.fromAscii("mb01"), {from: opSecondSigner});
        // Verify closure
        let proposition = await MinterContract.proposals(web3.utils.fromAscii("mb01"))
        assert.equal(proposition.status, true)
        // reject proposal test
        await tryCatch(MinterContract.reject(web3.utils.fromAscii("mb01"), {from: opFirstSigner}), errTypes.revert, errCodes.closedProposal);
    })

    it('#m12 - ctrlFirstSigner rejects proposal', async function (){
        // create proposal by opFirstSigner
        await MinterContract.createProposal(web3.utils.fromAscii("mm01"), 1000, web3.utils.fromAscii("mint"), contractAddr, {from: opFirstSigner});
        // accept opSecondSigner
        await MinterContract.accept(web3.utils.fromAscii("mm01"), {from: opSecondSigner});
        // ctrlSecondSigner accept test
        await MinterContract.accept(web3.utils.fromAscii("mm01"), {from: ctrlSecondSigner});
        // open and close proposal
        await MinterContract.createProposal(web3.utils.fromAscii("mb01"), 200, web3.utils.fromAscii("burn"), contractAddr, {from: opFirstSigner});
        await MinterContract.accept(web3.utils.fromAscii("mb01"), {from: ctrlSecondSigner});
        // Verify closure
        let proposition = await MinterContract.proposals(web3.utils.fromAscii("mb01"))
        assert.equal(proposition.status, true)
        // reject proposal
        await tryCatch(MinterContract.reject(web3.utils.fromAscii("mb01"), {from: ctrlFirstSigner}), errTypes.revert, errCodes.closedProposal);
    })

    it('#m13 - ctrlSecondSigner rejects proposal', async function (){
        // open and close proposal
        await MinterContract.createProposal(web3.utils.fromAscii("mb01"), 200, web3.utils.fromAscii("burn"), contractAddr, {from: opFirstSigner});
        await MinterContract.reject(web3.utils.fromAscii("mb01"), {from: ctrlFirstSigner});
        // Verify closure
        let proposition = await MinterContract.proposals(web3.utils.fromAscii("mb01"))
        assert.equal(proposition.status, true)
        // reject proposal
        await tryCatch(MinterContract.reject(web3.utils.fromAscii("mb01"), {from: ctrlSecondSigner}), errTypes.revert, errCodes.closedProposal);
    })

    it('#m14 - opSecondSigner creates a burn proposal', async function (){
        // create proposal
        await MinterContract.createProposal(web3.utils.fromAscii("mb02"), 100, web3.utils.fromAscii("burn"), contractAddr, {from: opSecondSigner});
    })

    it('#m15 - ctrlSecondSigner accepts proposal', async function (){
        // create proposal by opFirstSigner
        await MinterContract.createProposal(web3.utils.fromAscii("mm01"), 1000, web3.utils.fromAscii("mint"), contractAddr, {from: opFirstSigner});
        // accept opSecondSigner
        await MinterContract.accept(web3.utils.fromAscii("mm01"), {from: opSecondSigner});
        // ctrlSecondSigner accept test
        await MinterContract.accept(web3.utils.fromAscii("mm01"), {from: ctrlSecondSigner});
        // create proposal
        await MinterContract.createProposal(web3.utils.fromAscii("mb02"), 1000, web3.utils.fromAscii("burn"), contractAddr, {from: opSecondSigner});
        // function accept(bytes32 _proposalId)
        await MinterContract.accept(web3.utils.fromAscii("mb02"), {from: ctrlSecondSigner});
        // Verify closure
        let proposition = await MinterContract.proposals(web3.utils.fromAscii("mb02"))
        assert.equal(proposition.status, true)
    })

    it('#m16 - opSecondSigner creates an over burn proposal', async function (){
        // create proposal
        await MinterContract.createProposal(web3.utils.fromAscii("mb03"), 900000, web3.utils.fromAscii("burn"), contractAddr, {from: opSecondSigner});
    })

    it('#m17 - ctrlSecondSigner accepts proposal', async function (){
        // create proposal by opFirstSigner
        await MinterContract.createProposal(web3.utils.fromAscii("mm01"), 1000000, web3.utils.fromAscii("mint"), contractAddr, {from: opFirstSigner});
        // accept opSecondSigner
        await MinterContract.accept(web3.utils.fromAscii("mm01"), {from: opSecondSigner});
        // ctrlSecondSigner accept test
        await MinterContract.accept(web3.utils.fromAscii("mm01"), {from: ctrlSecondSigner});
        // create proposal
        await MinterContract.createProposal(web3.utils.fromAscii("mb03"), 900000, web3.utils.fromAscii("burn"), contractAddr, {from: opSecondSigner});
        // accept proposal
        await MinterContract.accept(web3.utils.fromAscii("mb03"), {from: ctrlSecondSigner});
    })

    it('#m18 - opFirstSigner creates eleven mint proposal', async function (){
        // create proposals
        await MinterContract.createProposal(web3.utils.fromAscii("over01"), 10000, web3.utils.fromAscii("mint"), contractAddr, {from: opFirstSigner});
        await MinterContract.createProposal(web3.utils.fromAscii("over02"), 10000, web3.utils.fromAscii("mint"), contractAddr, {from: opFirstSigner});
        await MinterContract.createProposal(web3.utils.fromAscii("over03"), 10000, web3.utils.fromAscii("mint"), contractAddr, {from: opFirstSigner});
        await MinterContract.createProposal(web3.utils.fromAscii("over04"), 10000, web3.utils.fromAscii("mint"), contractAddr, {from: opFirstSigner});
        await MinterContract.createProposal(web3.utils.fromAscii("over05"), 10000, web3.utils.fromAscii("mint"), contractAddr, {from: opFirstSigner});
        await MinterContract.createProposal(web3.utils.fromAscii("over06"), 10000, web3.utils.fromAscii("mint"), contractAddr, {from: opFirstSigner});
        await MinterContract.createProposal(web3.utils.fromAscii("over07"), 10000, web3.utils.fromAscii("mint"), contractAddr, {from: opFirstSigner});
        await MinterContract.createProposal(web3.utils.fromAscii("over08"), 10000, web3.utils.fromAscii("mint"), contractAddr, {from: opFirstSigner});
        await MinterContract.createProposal(web3.utils.fromAscii("over09"), 10000, web3.utils.fromAscii("mint"), contractAddr, {from: opFirstSigner});
        await MinterContract.createProposal(web3.utils.fromAscii("over10"), 10000, web3.utils.fromAscii("mint"), contractAddr, {from: opFirstSigner});
        // create proposals eleven
        await tryCatch(MinterContract.createProposal(web3.utils.fromAscii("over11"), 10000, web3.utils.fromAscii("mint"), contractAddr, {from: opFirstSigner}), errTypes.revert, errCodes.tooManyOpenProposals);

        // #m28 - ctrlFirstSigner rejects proposal over01
        await MinterContract.reject(web3.utils.fromAscii("over01"), {from: ctrlFirstSigner});
    })

    it('#m19 - opFirstSigner creates a zero mint', async function (){
        // create proposal
        await tryCatch(MinterContract.createProposal(web3.utils.fromAscii("neg01"), 0, web3.utils.fromAscii("mint"), contractAddr, {from: opFirstSigner}), errTypes.revert, errCodes.invalidAmount);
    })
})