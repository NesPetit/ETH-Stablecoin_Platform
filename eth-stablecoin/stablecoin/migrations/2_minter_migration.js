const MinterMultisig = artifacts.require("MinterMultisig");

const operateurs = ["0x6CC415E31a0Db68024f7760e98449f95F0Aeb420"];
const controleurs = ["0x759045281F79B8d138df0F9b0600dEb248Cf280d"];
const limit = 1;
const restriction = 10;

//constructor parameters : uint32 _limit, uint32 _restriction,  address[] memory _operators, address[] memory _controllers

module.exports = function(deployer) {
  deployer.deploy(MinterMultisig, limit, restriction, operateurs,controleurs);
};