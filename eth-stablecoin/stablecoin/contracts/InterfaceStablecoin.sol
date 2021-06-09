// SPDX-License-Identifier: MIt
pragma solidity >=0.4.22 <0.8.0;

contract InterfaceStablecoin {
    function setWhitelist(address _address, bool _whiteListed) public {}

    function setLock(address _address, bool _lock) public {}

    function setPause(bool _pause) public {}

    function setMinter(address _newMinter) public {}

    function setReserve(address _newReserve) public {}

    function setAdministrator(address _newAdministrator) public {}

    function transfer(
        uint256 _amount,
        address _from,
        address _to
    ) public {}

    function mint(uint256 _amount) public {}

    function burn(uint256 _amount) public {}
}
