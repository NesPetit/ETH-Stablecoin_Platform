const stablecoin = artifacts.require('Stablecoin.sol')

let tryCatch = require("./exceptions.js").tryCatch;
let errTypes = require("./exceptions.js").errTypes;

contract('Stablecoin contract test', function (accounts) {

    //Setup before each test
    beforeEach('setup contract for each test', async function () {
        //Deploying contract
        owner = accounts[0]
        administrator = accounts[1]
        minter = accounts[2]
        reserve = accounts[3]

        alice = accounts[4]
        bob = accounts[5]

        newMinter = accounts[6]
        newAdministrator = accounts[7]
        newReserve = accounts[8]

        StableCoinInstance = await stablecoin.new(administrator, minter, owner, {from: accounts[0]})
        await StableCoinInstance.setReserve(reserve, {from: accounts[0]})
    })
    

    //Minter tries to whiteList Alice's address
    it('lg01', async function () {
        await tryCatch(StableCoinInstance.setWhitelist(alice,true, {from: minter}), errTypes.revert);
    })

    //Administrator whiteLists Alice's address
    it('lg02', async function () {
        await StableCoinInstance.setWhitelist(alice,true, {from: administrator})
        await checkBalance(alice,0,true,false)
    })

    //Administrator whiteLists Alice's address
    it('lg03', async function () {
        await StableCoinInstance.setWhitelist(alice,true, {from: administrator})
        await checkBalance(alice,0,true,false)
    })

    //Administrator removes Alice's address from whiteList
    it('lg04', async function () {
        //white list alice
        await StableCoinInstance.setWhitelist(alice,true, {from: administrator})
        //remove alice from white list
        await StableCoinInstance.setWhitelist(alice,false, {from: administrator})
        //check alice balance
        await checkBalance(alice,0)
    })

    //Administrator tries to mint 1000.00 Lugh coins
    it('lg05', async function () {
        amountMinted = 100000
        await tryCatch(StableCoinInstance.mint(amountMinted, {from: administrator}), errTypes.revert);
    })

    //Minter mints 1000.00 Lugh coins
    it('lg06', async function () {
        amountMinted = 100000
        //mint tokens
        await StableCoinInstance.mint(amountMinted, {from: minter});
        //check reserve balance
        await checkBalance(reserve,amountMinted)
        //check circulating supply
        await checkCirculatingSupply(amountMinted)
    })  

    //Minter tries to resume transfers
    it('lg07', async function () {
        await tryCatch(StableCoinInstance.setPause(false, {from: minter}), errTypes.revert);
    })

    //Administrator resumes transfers
    it('lg08', async function () {
        await StableCoinInstance.setPause(false, {from: administrator})

        retrievedPause = await StableCoinInstance.pause()
        assert.equal(retrievedPause,false)
    })

    //Reserve tries to transfer 200.00 Lugh coins to Alice
    it('lg09', async function () {
        await tryCatch(StableCoinInstance.transfer(20000,reserve,alice, {from: reserve}), errTypes.revert);
    })

    //Administrator whiteLists Alice's address
    it('lg10', async function () {
        await StableCoinInstance.setWhitelist(alice,true, {from: administrator})
        await checkBalance(alice,0,true,false)
    })
    

    //Reserve transfers 200.00 Lugh coins to Alice
    it('lg11', async function () {
        amountMinted = 100000
        transferedAmount = 20000

        //white list alice
        await StableCoinInstance.setWhitelist(alice,true, {from: administrator})
        //mint 100000 coins
        await StableCoinInstance.mint(amountMinted, {from: minter});    

        //verify initial alice balance
        await checkBalance(alice,0,true,false)
        //verify initial reserve balance
        await checkBalance(reserve,amountMinted)

        //transfer 20000 coins
        await StableCoinInstance.transfer(transferedAmount,reserve,alice, {from: reserve})

        //verify alice balance
        await checkBalance(alice,transferedAmount,true,false)
        //verify reserve balance
        expectedReserveBalanceValue = amountMinted - transferedAmount
        await checkBalance(reserve,expectedReserveBalanceValue)
    })

    //Administrator whiteLists Bob's address
    it('lg12', async function () {
        await StableCoinInstance.setWhitelist(bob,true, {from: administrator})
        await checkBalance(bob,0,true,false)
    })

    //Alice transfers 50.00 Lugh coins to Bob
    it('lg13', async function () {
        amountMinted = 20000
        amountTransfered = 5000
        //white list alice and bob
        await StableCoinInstance.setWhitelist(alice,true, {from: administrator})
        await StableCoinInstance.setWhitelist(bob,true, {from: administrator})
        //mint tokens
        await StableCoinInstance.mint(amountMinted, {from:minter})
        //transfer tokens to alice
        await StableCoinInstance.transfer(amountMinted,reserve,alice, {from:reserve})
        //transfer tokens from alice to bob
        await StableCoinInstance.transfer(amountTransfered,alice,bob, {from:alice})

        //verify bob balance
        await checkBalance(bob,amountTransfered,true,false)
        //verify alice info
        expectedBalanceValue = amountMinted - amountTransfered
        await checkBalance(alice,expectedBalanceValue,true,false)
    })

    //Bob tries to transfer 150.00 Lugh coins for Alice to Reserve
    it('lg14', async function () {
        amount = 15000
        //mint 15000 tokens
        await StableCoinInstance.mint(amount, {from:minter})
        //white list alice
        await StableCoinInstance.setWhitelist(alice,true, {from: administrator})
        //transfer all of them to alice
        await StableCoinInstance.transfer(amount, reserve, alice, {from: reserve})
        //bob tries to transfer from alice without being administrator
        await tryCatch(StableCoinInstance.transfer(15000, alice, reserve, {from: bob}), errTypes.revert);
        //alice should still have 15000 tokens
        await checkBalance(alice,amount,true,false)
        //reserve balance should be empty
        await checkBalance(reserve,0)
    })

    //Alice transfers 150.00 Lugh coins to Reserve
    it('lg15', async function () {
        amount = 15000
        //mint 15000 tokens
        await StableCoinInstance.mint(amount, {from:minter})
        //white list alice
        await StableCoinInstance.setWhitelist(alice,true, {from: administrator})
        //transfer all of them to alice
        await StableCoinInstance.transfer(amount, reserve, alice, {from: reserve})
        //alice send 15000 back to reserve
        await StableCoinInstance.transfer(amount, alice, reserve, {from: alice})

        //verify alice balance
        await checkBalance(alice,0,true,false)
        //verify reserve balance
        await checkBalance(reserve,amount)
    })
    
    //Administrator pauses transfers
    it('lg16', async function () {
        await StableCoinInstance.setPause(true, {from: administrator})

        retrievedPause = await StableCoinInstance.pause()
        assert.equal(retrievedPause,true)
    })

    //Reserve tries to transfer 200.00 Lugh coins to Alice (transfers are paused)
    it('lg17', async function () {
        amount = 15000
        //mint 15000 tokens
        await StableCoinInstance.mint(amount, {from:minter})
        //white list alice
        await StableCoinInstance.setWhitelist(alice,true, {from: administrator})
        //transfer are paused
        await StableCoinInstance.setPause(true, {from: administrator})
        //reserve tries to send tokens to alice
        await tryCatch(StableCoinInstance.transfer(amount, reserve, alice, {from: reserve}), errTypes.revert);
    })

    //Administrator resumes transfers
    it('lg18', async function () {
        await StableCoinInstance.setPause(false, {from: administrator})

        retrievedPause = await StableCoinInstance.pause()
        assert.equal(retrievedPause,false)
    })

    //Administrator tries to force Bob to over transfer to Reserve
    it('lg19', async function () {
        amount = 15000
        tooHighAmount = 15001
        //mint 15000 tokens
        await StableCoinInstance.mint(amount, {from:minter})
        //white list alice
        await StableCoinInstance.setWhitelist(bob,true, {from: administrator})
        //transfer all of them to bob
        await StableCoinInstance.transfer(amount, reserve, bob, {from: reserve})
        //admin try to over transfer from bob
        await tryCatch(StableCoinInstance.transfer(tooHighAmount, bob, reserve, {from: administrator}), errTypes.revert);
        //verify that the transfer failed
        await checkBalance(bob,amount,true,false)
        await checkBalance(reserve,0,false,false)
    })

    //Administrator forces Bob to transfer 40.00 Lugh coins to Reserve
    it('lg20', async function () {
        amountMinted = 10000
        amountTransfered = 4000
        //mint 4000 tokens
        await StableCoinInstance.mint(amountMinted, {from:minter})
        //white list bob
        await StableCoinInstance.setWhitelist(bob,true, {from: administrator})
        //transfer all tokens minted to bob
        await StableCoinInstance.transfer(amountMinted, reserve, bob, {from: reserve})
        //administrator forces bob to send back tokens to reserve
        await StableCoinInstance.transfer(amountTransfered, bob, reserve, {from: administrator})

        //verify bob balance
        expectedAmount = amountMinted - amountTransfered
        await checkBalance(bob,expectedAmount,true,false)
        //verify reserve balance
        await checkBalance(reserve,amountTransfered)
    })

    //Administrator tries to transfer for Reserve 40.00 Lugh coins to Bob
    it('lg21', async function () {
        amountMinted = 10000
        amountTransfered = 4000
        //mint 4000 tokens
        await StableCoinInstance.mint(amountMinted, {from:minter})
        //white list bob
        await StableCoinInstance.setWhitelist(bob,true, {from: administrator})
        //administrator tries to transfer for reserve
        await tryCatch(StableCoinInstance.transfer(amountTransfered, reserve, bob, {from: administrator}), errTypes.revert)
        //check reserve balance
        await checkBalance(reserve,amountMinted)
        //check bob balance
        await checkBalance(bob,0,true,false)
    })

    //Bob tries to over transfer to Alice
    it('lg22', async function () {
        amountMinted = 10000
        amountTransfered = 10001
        //mint tokens
        await StableCoinInstance.mint(amountMinted, {from:minter})
        //white list alice and bob
        await StableCoinInstance.setWhitelist(bob,true, {from: administrator})
        await StableCoinInstance.setWhitelist(alice,true, {from: administrator})
        //reserve transfer tokens to bob
        await StableCoinInstance.transfer(amountMinted, reserve, bob, {from: reserve})
        //bob tries to over transfer
        await tryCatch(StableCoinInstance.transfer(amountTransfered, bob, alice, {from: bob}), errTypes.revert)
        //check alice balance
        await checkBalance(alice,0,true,false)
        //check bob balance
        await checkBalance(bob,amountMinted,true,false)
    })

    //Minter tries to lock Alice address
    it('lg23', async function () {
        await tryCatch(StableCoinInstance.setLock(alice, true, {from: minter}), errTypes.revert);
        await checkBalance(alice,0,false,false)
    })

    //Administrator locks Alice's address
    it('lg24', async function () {
        await StableCoinInstance.setLock(alice, true, {from: administrator})
        await checkBalance(alice,0,false,true)
    })

    //Reserve transfers 200.00 Lugh coins to Alice
    it('lg25', async function () {
        amountMinted = 100000
        amountTransfered = 20000
        //mint tokens
        await StableCoinInstance.mint(amountMinted, {from:minter})
        //white list and lock alice
        await StableCoinInstance.setWhitelist(alice,true, {from: administrator})
        await StableCoinInstance.setLock(alice,true, {from: administrator})
        //reserve transfer tokens to alice
        await StableCoinInstance.transfer(amountTransfered, reserve, alice, {from: reserve})
        //check alice and reserve balance
        await checkBalance(alice,amountTransfered,true,true)
        await checkBalance(reserve,amountMinted - amountTransfered)

    })

    //Alice tries to tranfer to 50.00 Lugh coins to Bob
    it('lg26', async function () {
        amountMinted = 100000
        amountTransfered = 20000
        //mint tokens
        await StableCoinInstance.mint(amountMinted, {from:minter})
        //white list and lock alice
        await StableCoinInstance.setWhitelist(alice,true, {from: administrator})
        await StableCoinInstance.setLock(alice,true, {from: administrator})
        
        //reserve transfer tokens to alice
        await StableCoinInstance.transfer(amountTransfered, reserve, alice, {from: reserve})
        //alice try to transfer tokens while she's locked
        await tryCatch(StableCoinInstance.transfer(amountTransfered, alice, bob, {from: alice}), errTypes.revert);
        
        //check alice balance
        await checkBalance(alice,amountTransfered,true,true)
        //check reserve balance
        expectedBalance = amountMinted - amountTransfered
        await checkBalance(reserve,expectedBalance,false,false)
    })

    //Administrator tries to burn 500.00 Lugh coins
    it('lg27', async function () {
        await StableCoinInstance.mint(50000, {from: minter})
        await tryCatch(StableCoinInstance.burn(50000, {from: administrator}), errTypes.revert);

        await checkCirculatingSupply(50000)
    })

    //Minter burns 500.00 Lugh coins
    it('lg28', async function () {
        mintedAmount = 100000
        burnedAmount = 50000
        //mint tokens
        await StableCoinInstance.mint(mintedAmount, {from: minter})
        //burn tokens
        await StableCoinInstance.burn(burnedAmount, {from: minter})

        //check circulating supply
        expectedCirculatingSupply = mintedAmount - burnedAmount
        await checkCirculatingSupply(expectedCirculatingSupply)
        //check reserve balance
        expectedReserveBalanceAmount = mintedAmount - burnedAmount
        await checkBalance(reserve,expectedReserveBalanceAmount)
    })

    //Administrator tries to change Minter
    it('lg29', async function () {
        await tryCatch(StableCoinInstance.setMinter(newMinter, {from: administrator}), errTypes.revert);

        retrievedMinter = await StableCoinInstance.sc_minter()
        assert.equal(retrievedMinter,minter)
    })

    //Owner changes Minter
    it('lg30', async function () {
        await StableCoinInstance.setMinter(newMinter, {from: owner})

        retrievedMinter = await StableCoinInstance.sc_minter()
        assert.equal(retrievedMinter,newMinter)
    })

    //Minter tries to mint 500.00 Lugh coins
    it('lg31', async function () {
        //set new minter
        await StableCoinInstance.setMinter(newMinter, {from: owner})
        //old minter try to mint tokens
        await tryCatch(StableCoinInstance.mint(50000, {from: minter}), errTypes.revert)
    })

    //newMinter mint 500.00 Lugh coins
    it('lg32', async function () {
        mintedAmount = 50000
        //change minter
        await StableCoinInstance.setMinter(newMinter, {from: owner})
        //mint tokens
        await StableCoinInstance.mint(mintedAmount, {from: newMinter})
        //check reserve balance
        await checkBalance(reserve,mintedAmount)
        //check circulating supply
        await checkCirculatingSupply(mintedAmount)
    })

    //Administrator tries to change Reserve
    it('lg33', async function () {
        await tryCatch(StableCoinInstance.setReserve(newReserve, {from: administrator}), errTypes.revert)

        retrievedReserve = await StableCoinInstance.reserve_address()
        assert.equal(retrievedReserve,reserve)
    })

    //Owner changes Reserve
    it('lg34', async function () {
        await StableCoinInstance.setReserve(newReserve, {from: owner})

        retrievedReserve = await StableCoinInstance.reserve_address()
        assert.equal(retrievedReserve,newReserve)
    })

    //newMinter mint 1000.00 Lugh coins on newReserve
    it('lg35', async function () {
        oldMinterAmount = 20000
        newMinterAmount = 50000
        //minter mint 20000 tokens
        await StableCoinInstance.mint(oldMinterAmount, {from: minter})
        //change minter
        await StableCoinInstance.setMinter(newMinter, {from: owner})
        //change reserve 
        await StableCoinInstance.setReserve(newReserve, {from: owner})
        //new minter mint tokens
        await StableCoinInstance.mint(newMinterAmount, {from: newMinter})

        //check newReserve balance
        await checkBalance(newReserve,newMinterAmount)
        //check old reserve balance
        await checkBalance(reserve,oldMinterAmount)
        //check circulating supply
        totalCirculatingSupply = oldMinterAmount + newMinterAmount
        await checkCirculatingSupply(totalCirculatingSupply)
    })

    //Administrator pauses transfers
    it('lg36', async function () {
        //owner change reserve and minter 
        await StableCoinInstance.setMinter(newMinter, {from: owner})
        await StableCoinInstance.setReserve(newReserve, {from: owner})
        //administrator pause transfer
        await StableCoinInstance.setPause(true, {from: administrator})
        //check pause value
        retrievedPause = await StableCoinInstance.pause()
        assert.equal(retrievedPause,true)
    })

    //Administrator transfers for Reserve coins to newReserve
    it('lg37', async function () {
        oldReserveAmount = 20000
        newReserveAmount = 50000
        amountTransfered = oldReserveAmount
        //mint tokens to reserve address
        await StableCoinInstance.mint(oldReserveAmount, {from: minter})
        //change reserve 
        await StableCoinInstance.setReserve(newReserve, {from: owner})
        //mint tokens to new reserve address
        await StableCoinInstance.mint(newReserveAmount, {from: minter})

        //admin transfer tokens from reserve to newReserve
        await StableCoinInstance.transfer(amountTransfered, reserve, newReserve, {from: administrator})

        //check reserve balance
        await checkBalance(reserve,oldReserveAmount - amountTransfered)
        //check new reserve balance
        await checkBalance(newReserve,newReserveAmount + amountTransfered)
    })


    //Administrator tries to change Administrator
    it('lg38', async function () {
        await tryCatch(StableCoinInstance.setAdministrator(newAdministrator, {from: administrator}), errTypes.revert)

        retrievedAdmin = await StableCoinInstance.sc_administrator()
        assert.equal(retrievedAdmin,administrator)
    })

    //Owner changes Administrator
    it('lg39', async function () {
        await StableCoinInstance.setAdministrator(newAdministrator, {from: owner})

        retrievedAdmin = await StableCoinInstance.sc_administrator()
        assert.equal(retrievedAdmin,newAdministrator)
    })

    //Administrator tries to resume transfer
    it('lg40', async function () {
        await StableCoinInstance.setAdministrator(newAdministrator, {from: owner})

        retrievedAdmin = await StableCoinInstance.sc_administrator()
        assert.equal(retrievedAdmin,newAdministrator)

        await tryCatch(StableCoinInstance.setPause(false, {from: administrator}), errTypes.revert)
    })

    //newAdministrator resumes transfer
    it('lg41', async function () {
        await StableCoinInstance.setAdministrator(newAdministrator, {from: owner})

        await StableCoinInstance.setPause(false, {from: newAdministrator})

        retrievedPause = await StableCoinInstance.pause()
        assert.equal(retrievedPause,false)
    })

    //newMinter tries to over burn from reserve
    it('lg42', async function () {
        mintedAmount = 50000
        successfullBurnedAmount = 1000
        failBurnedAmount = 1000000
        //set new minter
        await StableCoinInstance.setMinter(newMinter, {from: owner})
        //minter mint some tokens
        await StableCoinInstance.mint(mintedAmount, {from: newMinter})
        //minter burn some tokens
        await StableCoinInstance.burn(successfullBurnedAmount, {from: newMinter})
        //verify reserve balance after a successfull burn
        expectedBalance = mintedAmount - successfullBurnedAmount
        await checkBalance(reserve,expectedBalance)
        //try to over burn
        await tryCatch(StableCoinInstance.burn(failBurnedAmount, {from: newMinter}), errTypes.revert)
    })

    //newReserve tries to over transfer
    it('lg43', async function () {
        amount = 200000
        //set new reserve
        await StableCoinInstance.setReserve(newReserve, {from: owner})
        //mint tokens on newReserve
        await StableCoinInstance.mint(amount, {from: minter})
        //white list alice
        await StableCoinInstance.setWhitelist(alice,true, {from: administrator})
        //newReserve tries to over transfer
        await tryCatch(StableCoinInstance.transfer(amount+1, newReserve,alice, {from: newReserve}), errTypes.revert)

        //check alice balance
        await checkBalance(alice,0,true,false)
        //check newReserve balance
        await checkBalance(newReserve,amount)
    })  

    //newMinter burns all from reserve
    it('lg43', async function () {
        amount = 200000
        //set new reserve
        await StableCoinInstance.setReserve(newReserve, {from: owner})
        //set new minter
        await StableCoinInstance.setMinter(newMinter, {from: owner})
        //mint tokens on newReserve
        await StableCoinInstance.mint(amount, {from: newMinter})
        
        //newMinter burns all tokens
        await StableCoinInstance.burn(amount, {from: newMinter})

        //check reserve balance
        await checkBalance(reserve,0)
        //check newReserve balance
        await checkBalance(newReserve,0)
    })  

    
    //functions used several times in tests
    async function checkBalance(_address,_balance,_whiteListed=false,_lock=false){
        retrievedBalance = await StableCoinInstance.balances(_address)
        assert.equal(retrievedBalance.whiteListed,_whiteListed)
        assert.equal(retrievedBalance.lock,_lock)
        assert.equal(retrievedBalance.balance.toString(),_balance.toString())
    }
    async function checkCirculatingSupply(expectedCicurlatingSupply){
        retrievedCirculatingSupply = await  StableCoinInstance.circulatingSupply()
        assert.equal(retrievedCirculatingSupply,expectedCicurlatingSupply)
    }
})