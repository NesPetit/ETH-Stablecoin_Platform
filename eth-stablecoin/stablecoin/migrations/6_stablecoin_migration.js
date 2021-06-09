const Stablecoin = artifacts.require("Stablecoin");

const adminContract = "0xE1745d6a79Ca50257e3E5912c30b19a246876939";
const minterContract = "0x2B37cE74E6ce3e8f91699Ecf1A6B610C03C7264c";
const ownerContract = "0x6f593fc692bcE17fDfe1ef25255608fe4F2f8e4b";

// constructor parameters : address _administrator; address _minter; address _owner

module.exports = function(deployer) {
  deployer.deploy(Stablecoin, adminContract, minterContract, ownerContract);
};
