const AdminMultisig = artifacts.require("AdminMultisig");

const firstSigner = "0x16f8E8a2bFF91679f81230582Ed3704Df049B06a";
const secondSigner = "0xc41C0495F3d0ca5270046C5B663573f6047E269e";
const thirdSigner = "0xC36419322f8881f81Af994b1eD3BF2b710ac9AF3";
const signers = [firstSigner, secondSigner, thirdSigner];
const limit = 2;
const restriction = 3;

//  constructor parameters :  address[] memory _signers, uint32 _limit, uint32 _restriction

module.exports = function(deployer) {
  deployer.deploy(AdminMultisig, signers, limit, restriction);
};