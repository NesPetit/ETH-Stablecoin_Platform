// SPDX-License-Identifier: MIt
pragma solidity >=0.4.22 <0.8.0;

contract Stablecoin {
    address public sc_owner;
    address public sc_administrator;
    address public sc_minter;
    address public reserve_address;

    struct balance {
        uint256 balance;
        bool whiteListed;
        bool lock;
    }

    mapping(address => balance) public balances;
    bool public pause;
    uint256 public circulatingSupply;
    uint256 public totalSupply;
    uint32 public factor;
    string public ticker;

    constructor(
        address _administrator,
        address _minter,
        address _owner
    ) public {
        sc_owner = _owner;
        sc_administrator = _administrator;
        sc_minter = _minter;
        pause = false;
        circulatingSupply = 0;
        totalSupply = 1000000000; //??
        ticker = "SCE";
        factor = 2;

        balances[sc_owner].balance = totalSupply; //??
        emit Transfer(address(0), sc_owner, totalSupply);
    }

    //Events
    event Transfer(address _from, address _to, uint256 _amount);
    event SetAdministrator(address _address);
    event SetMinter(address _address);
    event SetReserve(address _address);
    event SetPause(bool _bool);
    event SetLock(address _address, bool _bool);
    event SetWhitelist(address _address, bool _bool);

    //Modifiers
    modifier onlyOwner() {
        require(msg.sender == sc_owner, "03");
        _;
    }

    modifier onlyAdministrator() {
        require(msg.sender == sc_administrator, "02");
        _;
    }

    modifier onlyMinter() {
        require(msg.sender == sc_minter, "04");
        _;
    }

    modifier checkTransferConditions(
        uint256 _amount,
        address _from,
        address _to
    ) {
        require(msg.sender == _from || msg.sender == sc_administrator, "09");
        if (_from == reserve_address) {
            require(msg.sender == reserve_address, "08");
        }
        if (_to != reserve_address) {
            require(balances[_to].whiteListed, "07");
        }
        require(!balances[_from].lock, "06");
        require(balances[_from].balance >= _amount, "10");
        require(!pause || msg.sender == sc_administrator, "01");
        _;
    }

    modifier checkBurnConditions(uint256 _amount) {
        require(balances[reserve_address].balance >= _amount, "11");
        _;
    }

    //Only owner functionalities
    function setAdministrator(address _newAdministrator) public onlyOwner() {
        sc_administrator = _newAdministrator;
        emit SetAdministrator(_newAdministrator);
    }

    function setMinter(address _newMinter) public onlyOwner() {
        sc_minter = _newMinter;
        emit SetMinter(_newMinter);
    }

    function setReserve(address _newReserve) public onlyOwner() {
        reserve_address = _newReserve;
        emit SetReserve(_newReserve);
    }

    //Only administrator functionalities
    function setPause(bool _pause) public onlyAdministrator() {
        pause = _pause;
        emit SetPause(_pause);
    }

    function setLock(address _address, bool _lock) public onlyAdministrator() {
        balances[_address].lock = _lock;
        emit SetLock(_address, _lock);
    }

    function setWhitelist(address _address, bool _whiteListed)
        public
        onlyAdministrator()
    {
        balances[_address].whiteListed = _whiteListed;
        balances[_address].balance = 0;
        balances[_address].lock = false;
        emit SetWhitelist(_address, _whiteListed);
    }

    //Transfer function
    function transfer(
        uint256 _amount,
        address _from,
        address _to
    ) public checkTransferConditions(_amount, _from, _to) {
        balances[_from].balance -= _amount;
        balances[_to].balance += _amount;
        emit Transfer(_from, _to, _amount);
    }

    //Only Minter functionalities
    function mint(uint256 _amount) public onlyMinter() {
        balances[reserve_address].balance += _amount;
        circulatingSupply += _amount;
        emit Transfer(address(0), reserve_address, _amount);
    }

    function burn(uint256 _amount)
        public
        onlyMinter()
        checkBurnConditions(_amount)
    {
        balances[reserve_address].balance -= _amount;
        circulatingSupply -= _amount;
        emit Transfer(reserve_address, address(0), _amount);
    }
}
