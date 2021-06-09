module.exports.errTypes = {
    revert: "revert",
    outOfGas: "out of gas",
    invalidJump: "invalid JUMP",
    invalidOpcode: "invalid opcode",
    stackOverflow: "stack overflow",
    stackUnderflow: "stack underflow",
    staticStateChange: "static state change"
}
module.exports.errCodesAdmin = {
    invalidSigner: "01",
    proposalIdAlreadyInContract: "02",
    invalidProposalId: "03",
    tooManyOpenProposals: "04",
    closedProposal: "05",
    invalidOperation: "06",
    alreadyAccept: "07"
}

module.exports.errCodesReserve = {
    unreferencedSigningAddress: "01",
    proposalIdAlreadyReferenced: "02",
    proposalIdNotReferenced: "03",
    openProposalsLimitReached: "04",
    proposalAlreadyClosed: "05",
    transferAmountNotPermitted: "06",
    proposalAlreadyAccepted: "07"
}

module.exports.errCodesMinter = {
    invalidSigner                : "01",
    proposalIdAlreadyInContract  : "02",
    invalidProposalId            : "03",
    tooManyOpenProposals         : "04",
    closedProposal               : "05",
    invalidOperation             : "06",
    invalidAmount                : "07",
    alreadyAccept                : "08"
}

module.exports.errCodesOwner = {
	
    invalidSigner                : "01",
    proposalIdAlreadyInContract  : "02",
    invalidProposalId            : "03",
    tooManyOpenProposals         : "04",
    closedProposal               : "05",
    invalidOperation             : "06",
    proposalAlreadyAccepted      : "07"
}


module.exports.tryCatch = async function (promise, errType, errCode = null) {
    try {
        await promise;
        throw null;
    }
    catch (error) {
        assert(error, "Expected an error but did not get one");
        if (errCode != null) {
            assert(error.message.startsWith(PREFIX + errType + " " + errCode), "Expected an error starting with '" + PREFIX + errType + errCode + "' but got '" + error.message + "' instead")
        }
        else {
            assert(error.message.startsWith(PREFIX + errType), "Expected an error starting with '" + PREFIX + errType + "' but got '" + error.message + "' instead")
        }

    }
};

const PREFIX = "Returned error: VM Exception while processing transaction: ";