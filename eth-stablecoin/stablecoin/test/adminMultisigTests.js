const adminMultisig = artifacts.require('AdminMultisig.sol')
const stableCoin = artifacts.require('Stablecoin.sol')

let tryCatch = require("./exceptions.js").tryCatch;
let errTypes = require("./exceptions.js").errTypes;
let errCodes = require("./exceptions.js").errCodesAdmin;

contract('Testing Admin Multisig contract', function (accounts) {

    const firstSigner = accounts[0]
    const secondSigner = accounts[1]
    const thirdSigner = accounts[2]
    const alice = accounts[3]
    const bob = accounts[4]
    const owner = accounts[5]
    const reserve = accounts[6]

    // Setup before each test
    beforeEach('setup contract for each test', async function () {
        // Deploying contract
        AdminContract = await adminMultisig.new([firstSigner, secondSigner, thirdSigner], 2, 40, { from: accounts[0] })
        StableCoin = await stableCoin.new(AdminContract.address, accounts[5], owner, { from: accounts[0] })
        contractAddr = StableCoin.address
    })
    it('firstSigner tries to create a setAdministrator proposal', async function () {
        await tryCatch(AdminContract.createAddressProposal(web3.utils.fromAscii("setAdministrator"), web3.utils.fromAscii("aw01"), alice, true, contractAddr,
            { from: firstSigner }), errTypes.revert, errCodes.invalidOperation)
    })

    it('signer not in authorized signers tries to create a pause proposal', async function () {
        await tryCatch(AdminContract.createPauseProposal(web3.utils.fromAscii("aw01"), alice, true, contractAddr,
            { from: accounts[9] }), errTypes.revert, errCodes.invalidSigner)
    })

    it('signer tries to create setWhiteListingProposal and to validate it (=double validation)', async function () {
        let propositionId = "aw01"
        await AdminContract.createAddressProposal(web3.utils.fromAscii("setWhiteListing"), web3.utils.fromAscii(propositionId), alice, true, contractAddr,
            { from: firstSigner })
        assert.equal(await AdminContract.openProposals(), 1)
        assert.equal(await AdminContract.getAllProposalsCount(),1)
        await tryCatch(AdminContract.accept(web3.utils.fromAscii(propositionId), { from: firstSigner }), errTypes.revert, errCodes.alreadyAccept)
    })

    it('second signer tries to reject proposal proposed by first signer', async function () {
        let propositionId = "aw01"
        await AdminContract.createAddressProposal(web3.utils.fromAscii("setWhiteListing"), web3.utils.fromAscii(propositionId), alice, true, contractAddr,
            { from: firstSigner })
        await AdminContract.reject(web3.utils.fromAscii(propositionId), { from: secondSigner })
        let proposition = await AdminContract.proposals(web3.utils.fromAscii(propositionId))
        assert.equal(proposition.status, true)
        assert.equal(await AdminContract.openProposals(), 0)
    })

    it('third signer tries to accept rejected proposal', async function () {
        let propositionId = "aw01"
        await AdminContract.createAddressProposal(web3.utils.fromAscii("setWhiteListing"), web3.utils.fromAscii(propositionId), alice, true, contractAddr,
            { from: firstSigner })
        await AdminContract.reject(web3.utils.fromAscii(propositionId), { from: secondSigner })
        await tryCatch(AdminContract.accept(web3.utils.fromAscii(propositionId), { from: thirdSigner }), errTypes.revert, errCodes.closedProposal)
    })

    it('first signer tries to create a createPauseProposal twice (proposal id duplication)', async function () {
        let propositionId = "aw01"
        await AdminContract.createPauseProposal(web3.utils.fromAscii(propositionId), alice, true, contractAddr,
            { from: firstSigner })
        await tryCatch(AdminContract.createPauseProposal(web3.utils.fromAscii(propositionId), alice, true, contractAddr,
            { from: firstSigner }), errTypes.revert, errCodes.proposalIdAlreadyInContract)
    })

    it('first signer creates setLock Proposal, second signer validates it and third signer tries to validate already accepted proposition', async function () {
        let propositionId = "aw01"
        await AdminContract.createAddressProposal(web3.utils.fromAscii("setLock"), web3.utils.fromAscii(propositionId), bob, false, contractAddr,
            { from: firstSigner })
        assert.equal(await AdminContract.openProposals(), 1)
        await AdminContract.accept(web3.utils.fromAscii(propositionId), { from: secondSigner })
        await tryCatch(AdminContract.accept(web3.utils.fromAscii(propositionId), { from: thirdSigner }), errTypes.revert, errCodes.closedProposal)
    })

    it('first signer creates a transfer Proposal, second signer rejects it and third signer tries to reject already rejected proposition', async function () {
        let propositionId = "ap01"
        await AdminContract.createTransferProposal(web3.utils.fromAscii(propositionId), 10, reserve, bob, false, contractAddr,
            { from: firstSigner })
        assert.equal(await AdminContract.openProposals(), 1)
        await AdminContract.reject(web3.utils.fromAscii(propositionId), { from: secondSigner })
        await tryCatch(AdminContract.reject(web3.utils.fromAscii(propositionId), { from: thirdSigner }), errTypes.revert, errCodes.closedProposal)
    })

    it('first signer creates a whitelist proposal, second signer accepts it,so address is whitelisted', async function () {
        let WhiteListProposal = "aw01"
        await AdminContract.createAddressProposal(web3.utils.fromAscii("setWhiteListing"), web3.utils.fromAscii(WhiteListProposal), reserve, true, contractAddr,
            { from: firstSigner })
        await AdminContract.accept(web3.utils.fromAscii(WhiteListProposal), { from: secondSigner })
        assert.equal((await StableCoin.balances(reserve)).whiteListed, true)
    })

    it('first signer tries to validate proposition with fakeId', async function () {
        let fakeId = "fakeId"
        await tryCatch(AdminContract.accept(web3.utils.fromAscii(fakeId), { from: firstSigner }), errTypes.revert, errCodes.invalidProposalId)
    })
})