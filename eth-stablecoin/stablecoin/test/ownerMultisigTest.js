const ownerMultiSig = artifacts.require('OwnerMultisig.sol');
const stableCoin = artifacts.require('Stablecoin.sol');

let tryCatch = require("./exceptions.js").tryCatch;
let errTypes = require("./exceptions.js").errTypes;
let errCodes = require("./exceptions.js").errCodesOwner;


contract('Testing OwnerMultiSig contract', function (accounts) {

    const firstSigner = accounts[0]
    const secondSigner = accounts[1]
    const thirdSigner = accounts[8]
    const minter = accounts[3]
    const administrator = accounts[4]
    const reserve = accounts[5]
    const deploymentAccount = accounts[6]


    // Setup before each test
    beforeEach('setup contract for each test', async function () {
        // Deploying contract
        OwnerMultiSigInstance = await ownerMultiSig.new([firstSigner,secondSigner,thirdSigner],3,4, {from: deploymentAccount});
        StableCoin = await stableCoin.new(administrator, minter, OwnerMultiSigInstance.address, { from: deploymentAccount});
        contractAddr = StableCoin.address;
    })

    // Tests routines start with "it"

    it('#o01 - firstSigner tries to create a transfer proposal', async function (){
        // function createProposal(bytes32 _proposalId, address _proposalAddr, bytes32 _operation, address _contractAddr, bool _state)
        await tryCatch(OwnerMultiSigInstance.createProposal(web3.utils.fromAscii("om01"), minter, web3.utils.fromAscii("setOwner"), contractAddr, false, {from: firstSigner}), errTypes.revert, errCodes.invalidOperation);
    })

    it('#o02 - firstSigner creates a setMinter proposal', async function (){
         // function createProposal(bytes32 _proposalId, address _proposalAddr, bytes32 _operation, address _contractAddr, bool _state)
        await OwnerMultiSigInstance.createProposal(web3.utils.fromAscii("om01"), minter, web3.utils.fromAscii("setMinter"), contractAddr, false, {from: firstSigner});
    })

    it('#o03 - firstSigner accepts proposal', async function (){
        //function accept(bytes32 _proposalId) 
        await OwnerMultiSigInstance.createProposal(web3.utils.fromAscii("om01"), minter, web3.utils.fromAscii("setMinter"), contractAddr, false, {from: firstSigner});
        await tryCatch(OwnerMultiSigInstance.accept(web3.utils.fromAscii("om01"), {from: firstSigner}), errTypes.revert, errCodes.proposalAlreadyAccepted);
    })

    it('#o04 - secondSigner accepts unreferenced proposal', async function (){
        //function accept(bytes32 _proposalId) 
        await OwnerMultiSigInstance.createProposal(web3.utils.fromAscii("om01"), minter, web3.utils.fromAscii("setMinter"), contractAddr, false, {from: firstSigner});
        await tryCatch(OwnerMultiSigInstance.accept(web3.utils.fromAscii("om02"), {from: secondSigner}), errTypes.revert, errCodes.invalidProposalId);
    })

    it('#o05 - secondSigner accepts proposal', async function (){
        //function accept(bytes32 _proposalId)
        await OwnerMultiSigInstance.createProposal(web3.utils.fromAscii("om01"), minter, web3.utils.fromAscii("setMinter"), contractAddr, false, {from: firstSigner});
        await OwnerMultiSigInstance.accept(web3.utils.fromAscii("om01"), {from: secondSigner});
    })

    it('#o06 - thirdSigner accepts proposal', async function (){
        await OwnerMultiSigInstance.createProposal(web3.utils.fromAscii("om01"), minter, web3.utils.fromAscii("setMinter"), contractAddr, false, {from: firstSigner});
        //function accept(bytes32 _proposalId)
        await OwnerMultiSigInstance.accept(web3.utils.fromAscii("om01"), {from: secondSigner});
        await OwnerMultiSigInstance.accept(web3.utils.fromAscii("om01"), {from: thirdSigner});
    })

    it('#o07 - secondSigner tries to create a setAdministrator proposal', async function (){
        // function createProposal(bytes32 _proposalId, address _proposalAddr, bytes32 _operation, address _contractAddr, bool _state)
        await OwnerMultiSigInstance.createProposal(web3.utils.fromAscii("om01"), minter, web3.utils.fromAscii("setMinter"), contractAddr, false, {from: firstSigner});
        await tryCatch(OwnerMultiSigInstance.createProposal(web3.utils.fromAscii("om01"), administrator, web3.utils.fromAscii("setAdministrator"), contractAddr, {from: secondSigner}), errTypes.revert, errCodes.proposalIdAlreadyInContract);

    })

    it('#o08 - secondSigner tries to create a setAdministrator proposal', async function (){
        // function createProposal(bytes32 _proposalId, address _proposalAddr, bytes32 _operation, address _contractAddr, bool _state)
        await OwnerMultiSigInstance.createProposal(web3.utils.fromAscii("oa01"), administrator, web3.utils.fromAscii("setAdministrator"), contractAddr, false, {from: secondSigner});
    })

    it('#o09 - firstSigner rejects proposal', async function (){
        // function createProposal(bytes32 _proposalId, address _proposalAddr, bytes32 _operation, address _contractAddr, bool _state)
        await OwnerMultiSigInstance.createProposal(web3.utils.fromAscii("oa01"), administrator, web3.utils.fromAscii("setAdministrator"), contractAddr, false, {from: secondSigner});
        // function reject(bytes32 _proposalId) 
        await OwnerMultiSigInstance.reject(web3.utils.fromAscii("oa01"), {from: firstSigner});
    })

    it('#o10 - thirdSigner accepts proposal', async function (){
        // function createProposal(bytes32 _proposalId, address _proposalAddr, bytes32 _operation, address _contractAddr, bool _state)
        await OwnerMultiSigInstance.createProposal(web3.utils.fromAscii("oa01"), administrator, web3.utils.fromAscii("setAdministrator"), contractAddr, false, {from: secondSigner});
        // function reject(bytes32 _proposalId) 
        await OwnerMultiSigInstance.reject(web3.utils.fromAscii("oa01"), {from: firstSigner});
        // //function accept(bytes32 _proposalId) 
        await tryCatch(OwnerMultiSigInstance.accept(web3.utils.fromAscii("oa01"), {from: thirdSigner}), errTypes.revert, errCodes.closedProposal);
    })

    it('#o11 - firstSigner accepts proposal', async function (){
         // function createProposal(bytes32 _proposalId, address _proposalAddr, bytes32 _operation, address _contractAddr, bool _state)
         await OwnerMultiSigInstance.createProposal(web3.utils.fromAscii("oa01"), administrator, web3.utils.fromAscii("setAdministrator"), contractAddr, false, {from: secondSigner});
         // function reject(bytes32 _proposalId) 
         await OwnerMultiSigInstance.reject(web3.utils.fromAscii("oa01"), {from: firstSigner});
         //function accept(bytes32 _proposalId) 
         await tryCatch(OwnerMultiSigInstance.accept(web3.utils.fromAscii("oa01"), {from: firstSigner}), errTypes.revert, errCodes.closedProposal);
    })

    it('#o12 - thirdSigner creates a setReserve proposal', async function (){
        // function createProposal(bytes32 _proposalId, address _proposalAddr, bytes32 _operation, address _contractAddr, bool _state)
        await OwnerMultiSigInstance.createProposal(web3.utils.fromAscii("or01"), reserve, web3.utils.fromAscii("setReserve"), contractAddr, false, {from: thirdSigner});
    })
 
    it('#o13 - second signer accepts proposal', async function (){
        let propositionId= "0369p"
        // function createProposal(bytes32 _proposalId, address _proposalAddr, bytes32 _operation, address _contractAddr, bool _state)
        await OwnerMultiSigInstance.createProposal(web3.utils.fromAscii(propositionId), reserve, web3.utils.fromAscii("setReserve"), contractAddr, false, {from: thirdSigner});
        //function accept(bytes32 _proposalId) 
        await OwnerMultiSigInstance.accept(web3.utils.fromAscii(propositionId), {from: secondSigner});
    })

    it('#o14 - first signer accepts proposal', async function (){
        //function createProposal(bytes32 _proposalId, address _proposalAddr, bytes32 _operation, address _contractAddr, bool _state)        
        await OwnerMultiSigInstance.createProposal(web3.utils.fromAscii("or01"), reserve, web3.utils.fromAscii("setReserve"), contractAddr, false, {from: thirdSigner});
        
        //function accept(bytes32 _proposalId) 
        await OwnerMultiSigInstance.accept(web3.utils.fromAscii("or01"), {from: secondSigner});
        await OwnerMultiSigInstance.accept(web3.utils.fromAscii("or01"), {from: firstSigner});
    })

    it('#o15 - firstSigner creates a setMinter proposal', async function (){
        // function createProposal(bytes32 _proposalId, address _proposalAddr, bytes32 _operation, address _contractAddr, bool _state)
        await OwnerMultiSigInstance.createProposal(web3.utils.fromAscii("om02"), administrator, web3.utils.fromAscii("setMinter"), contractAddr, false, {from: firstSigner});
    })

    it('#o16 - secondSigner rejects proposal', async function (){
        // function createProposal(bytes32 _proposalId, address _proposalAddr, bytes32 _operation, address _contractAddr, bool _state)
        await OwnerMultiSigInstance.createProposal(web3.utils.fromAscii("om02"), administrator, web3.utils.fromAscii("setMinter"), contractAddr, false, {from: firstSigner});
        // function reject(bytes32 _proposalId) 
        await OwnerMultiSigInstance.reject(web3.utils.fromAscii("om02"), {from: secondSigner});
    })

    it('#o17 - thirdSigner rejects proposal', async function (){
        // function createProposal(bytes32 _proposalId, address _proposalAddr, bytes32 _operation, address _contractAddr, bool _state)
        await OwnerMultiSigInstance.createProposal(web3.utils.fromAscii("om02"), administrator, web3.utils.fromAscii("setMinter"), contractAddr, false, {from: firstSigner});
        // function reject(bytes32 _proposalId) 
        await OwnerMultiSigInstance.reject(web3.utils.fromAscii("om02"), {from: secondSigner});
        // function reject(bytes32 _proposalId) 
        await tryCatch(OwnerMultiSigInstance.reject(web3.utils.fromAscii("om02"), {from: thirdSigner}), errTypes.revert, errCodes.closedProposal);
    })

    it('#o18 - firstSigner rejects proposal', async function (){
        // function createProposal(bytes32 _proposalId, address _proposalAddr, bytes32 _operation, address _contractAddr, bool _state)
        await OwnerMultiSigInstance.createProposal(web3.utils.fromAscii("om02"), administrator, web3.utils.fromAscii("setMinter"), contractAddr, false, {from: firstSigner});
        // function reject(bytes32 _proposalId) 
        await OwnerMultiSigInstance.reject(web3.utils.fromAscii("om02"), {from: secondSigner});
        // function reject(bytes32 _proposalId) 
        await tryCatch(OwnerMultiSigInstance.reject(web3.utils.fromAscii("om02"), {from: firstSigner}), errTypes.revert, errCodes.closedProposal);
    })

    it('#o19 - firstSigner creates a first setMinter proposal', async function (){
        // function createProposal(bytes32 _proposalId, address _proposalAddr, bytes32 _operation, address _contractAddr, bool _state)
        await OwnerMultiSigInstance.createProposal(web3.utils.fromAscii("over01"), minter, web3.utils.fromAscii("setMinter"), contractAddr, false, {from: firstSigner});
    })

    it('#o20 - firstSigner creates a second setMinter proposal', async function (){
        // function createProposal(bytes32 _proposalId, address _proposalAddr, bytes32 _operation, address _contractAddr, bool _state)
        await OwnerMultiSigInstance.createProposal(web3.utils.fromAscii("over01"), minter, web3.utils.fromAscii("setMinter"), contractAddr, false, {from: firstSigner});
        await OwnerMultiSigInstance.createProposal(web3.utils.fromAscii("over02"), minter, web3.utils.fromAscii("setMinter"), contractAddr, false, {from: firstSigner});
    })

    it('#o21 - firstSigner creates a third setMinter proposal', async function (){
        // function createProposal(bytes32 _proposalId, address _proposalAddr, bytes32 _operation, address _contractAddr, bool _state)
        await OwnerMultiSigInstance.createProposal(web3.utils.fromAscii("over01"), minter, web3.utils.fromAscii("setMinter"), contractAddr, false,  {from: firstSigner});
        await OwnerMultiSigInstance.createProposal(web3.utils.fromAscii("over02"), minter, web3.utils.fromAscii("setMinter"), contractAddr, false,  {from: firstSigner});
        await OwnerMultiSigInstance.createProposal(web3.utils.fromAscii("over03"), minter, web3.utils.fromAscii("setMinter"), contractAddr, false,  {from: firstSigner});
    })

    it('#o22 - firstSigner creates a fourth setMinter proposal', async function (){
        // function createProposal(bytes32 _proposalId, address _proposalAddr, bytes32 _operation, address _contractAddr, bool _state)
        //await OwnerMultiSigInstance.createProposal(web3.utils.fromAscii("over04"), minter, web3.utils.fromAscii("setMinter"), contractAddr, {from: firstSigner});
        await OwnerMultiSigInstance.createProposal(web3.utils.fromAscii("over01"), minter, web3.utils.fromAscii("setMinter"), contractAddr, false, {from: firstSigner});
        await OwnerMultiSigInstance.createProposal(web3.utils.fromAscii("over02"), minter, web3.utils.fromAscii("setMinter"), contractAddr, false, {from: firstSigner});
        await OwnerMultiSigInstance.createProposal(web3.utils.fromAscii("over03"), minter, web3.utils.fromAscii("setMinter"), contractAddr, false, {from: firstSigner});
        await OwnerMultiSigInstance.createProposal(web3.utils.fromAscii("over04"), minter, web3.utils.fromAscii("setMinter"), contractAddr, false, {from: firstSigner});
    })

    it('#o23 - firstSigner creates a fifth setMinter proposal', async function (){
        // function createProposal(bytes32 _proposalId, address _proposalAddr, bytes32 _operation, address _contractAddr, bool _state)
        //await OwnerMultiSigInstance.createProposal(web3.utils.fromAscii("over04"), minter, web3.utils.fromAscii("setMinter"), contractAddr, {from: firstSigner});
        await OwnerMultiSigInstance.createProposal(web3.utils.fromAscii("over01"), minter, web3.utils.fromAscii("setMinter"), contractAddr, false, {from: firstSigner});
        await OwnerMultiSigInstance.createProposal(web3.utils.fromAscii("over02"), minter, web3.utils.fromAscii("setMinter"), contractAddr, false, {from: firstSigner});
        await OwnerMultiSigInstance.createProposal(web3.utils.fromAscii("over03"), minter, web3.utils.fromAscii("setMinter"), contractAddr, false, {from: firstSigner});
        await OwnerMultiSigInstance.createProposal(web3.utils.fromAscii("over04"), minter, web3.utils.fromAscii("setMinter"), contractAddr, false, {from: firstSigner});
        await tryCatch(OwnerMultiSigInstance.createProposal(web3.utils.fromAscii("over05"), minter, web3.utils.fromAscii("setMinter"), contractAddr, false, {from: firstSigner}), errTypes.revert, errCodes.tooManyOpenProposals);
    })

})