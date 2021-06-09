# Eth StableCoin documentation

The purpose of this project is to adapt for Ethereum the smarts contracts of the LughCoin initially written for the Tezos blockchain. We will explain and detail the following sections :

#### 1. Presentation and use of the tools involved

**Truffle** is the most popular development framework for Ethereum with a mission to make your life a whole lot easier. In order to use truffle you first have to : 

```
npm i truffle -g
```
##### Requirements
- NodeJS v8.9.4 or later
- Windows, Linux or Mac OS X

Truffle also requires that you have a running Ethereum client which supports the standard JSON RPC API (which is nearly all of them). There are many to choose from, and some better than others for development. We'll discuss them in detail in the [Choosing an Ethereum client](https://www.trufflesuite.com/docs/truffle/reference/choosing-an-ethereum-client) section.

##### Recommandations for Windows

If you're running Truffle on Windows, you may encounter some naming conflicts that could prevent Truffle from executing properly. Please see [the section on resolving naming conflicts](https://www.trufflesuite.com/docs/truffle/reference/configuration#resolving-naming-conflicts-on-windows) for solutions.

##### More informations about Truffle 

You will find more details in the Truffle [documentation](https://www.trufflesuite.com/docs/truffle/overview).

___

**Ganache** is a personal blockchain for rapid Ethereum and Corda distributed application development. You can use Ganache across the entire development cycle; enabling you to develop, deploy, and test your dApps in a safe and deterministic environment.

Ganache UI is desktop application supporting both Ethereum and Corda technology. In addition, an Ethereum version of ganache is available as a command-line tool: [ganache-cli](https://github.com/trufflesuite/ganache-cli) (formerly known as the TestRPC). All versions of [Ganache](https://www.trufflesuite.com/ganache) are available for Windows, Mac, and Linux

##### More infomations about Ganache

Ganache is not necessarily required to compile, deploy and test our various contracts. However, it is a very powerful tool that helps speed up the production of a smart contract. You will find all the documentation [here](https://www.trufflesuite.com/docs/ganache/quickstart).

___

**Remix IDE** is an open source web and desktop application. It fosters a fast development cycle and has a rich set of plugins with intuitive GUIs. Remix is used for the entire journey of contract development as well as being a playground for learning and teaching Ethereum.

Remix IDE is part of the Remix Project which is a platform for development tools that use a plugin architecture. It encompasses sub-projects including Remix Plugin Engine, Remix Libs, and of course Remix-IDE.

##### More infomations about Remix IDE

You will find more details on Remix IDE documentation [there](https://remix-ide.readthedocs.io/en/latest/). To load the Remix IDE, click on this [link](https://remix.ethereum.org/).

___

**Visual Studio Code** is an extensible [code editor](https://code.visualstudio.com/) developed by Microsoft for Windows, Linux and macOS.

Features include debugging support, syntax highlighting, intelligent code completion, snippets, code refactoring and integrated Git. Users can change the theme, keyboard shortcuts, preferences, and install extensions that add additional functionality.

##### More informations about Visual Studio Code 

You will find more details on VSCode documentation [there](https://code.visualstudio.com/docs).

___

**Solidity** is the language used in Ethereum to create smart contracts. You will find the VSCode extension and the associated documentation [here](https://marketplace.visualstudio.com/items?itemName=JuanBlanco.solidity#:~:text=Solidity%20support%20for%20Visual%20Studio,Syntax%20highlighting&text=Compilation%20of%20all%20the%20contracts,Ctrl%2BF5%20%2F%20Cmd%2BF5).

#### 2. Get started

In this project, we prefer to use the Truffle suite and the VSCode editor rather than developing the smarts contracts directly on Remix IDE.

___

##### Requirements

1. [Git](https://nodejs.org/en/) 
2. [Visual Studio Code](https://code.visualstudio.com/)
3. [NodeJS](https://nodejs.org/en/)
4. [Truffle](https://www.trufflesuite.com/truffle)
5. [Configuring Visual Studio Code For Ethereum Blockchain Development](https://www.trufflesuite.com/tutorials/configuring-visual-studio-code)

___

##### First steps

Open a git terminal and move to the directory where you want to install the project. Once in this directory, execute the following command to retrieve the last state of the project saved on gitlab.


```
git clone https://github.com/NesPetit/ETH-Stablecoin_Platform.git

```
You should now see in your directory a file folder named `eth-stablecoin-platform`.

> Open _eth-stablecoin-platform/eth-smart-contracts_ folder.

You should see three files : 

- The **.git** folder (hidden) contains all the version control information you need for your project and all the information about commits, the remote repository address, and so on. All of this information is in this folder. It also contains a log that stores the history of your commits so you can go back to the history.

- The **stablecoin** folder which contains each element of our Ethereum stablecoin. We will study its architecture more precisely a little later.

> Open _stablecoin_ folder.

Once this operation is completed, you'll now have a project structure with the following items :

- **contracts :** Directory for [Solidity contracts](https://www.trufflesuite.com/docs/truffle/getting-started/interacting-with-your-contracts).
- **migrations :** Directory for [scriptable deployment files](https://www.trufflesuite.com/docs/truffle/getting-started/running-migrations#migration-files).
- **test :** Directory for test files for [testing your application and contracts](https://www.trufflesuite.com/docs/truffle/testing/testing-your-contracts).
- **truffle-config.js :** Truffle [configuration file](https://www.trufflesuite.com/docs/truffle/reference/configuration).

Make sure you have correctly installed Truffle by using the `truffle version` command in your terminal. To execute the Truffle commands correctly, you will need to be in the `$PATH/eth-smart-contracts/eth-smart-contracts/stablecoin` directory.  

#### 3. General notes on the smarts contracts code.

All the smarts contracts are located in the **contracts** folder. 

Here we find seven contracts, they are identifiable by their `.sol` extension :
- **Stablecoin.sol**, Ethereum smart contract for Lugh stable coin.
- **InterfaceStablecoin.sol**, Interfaces are similar to abstract contracts and are created using interface keyword. [More details](https://www.tutorialspoint.com/solidity/solidity_interfaces.htm).
- **AdminMultisig.sol**, Ethereum multisig smart contract for `Admin` operations on Lugh stable coin.
- **MinterMultisig.sol**, Ethereum multisig smart contract for `Reserve` operations on Lugh stable coin.
- **OwnerMultisig.sol**, Ethereum multisig smart contract for `Owner` operations on Lugh stable coin.
- **ReserveMultisig.sol**, Ethereum multisig smart contract for `Reserve` operations on Lugh stable coin.
- **Migrations.sol**, This contract keeps track of which migrations were done on the current network. [More details](https://ethereum.stackexchange.com/questions/56411/what-is-the-role-of-migrations-sol-contract-in-truffle-project).

___

**Important Solidity concepts.**

In this section, we scan the [Solidity concepts](https://www.tutorialspoint.com/solidity/index.htm) used in our different contracts.

###### Basics :
- [Solidity - Types](https://www.tutorialspoint.com/solidity/solidity_types.htm)
- [Solidity - Special Variables](https://www.tutorialspoint.com/solidity/solidity_special_variables.htm)
- [Solidity - Structs](https://www.tutorialspoint.com/solidity/solidity_structs.htm)
- [Solidity - Mapping](https://www.tutorialspoint.com/solidity/solidity_mappings.htm)

###### Functions :
- [Solidity - Functions](https://www.tutorialspoint.com/solidity/solidity_functions.htm)
- [Solidity - Function Modifiers](https://www.tutorialspoint.com/solidity/solidity_function_modifiers.htm)

###### Advanced :
- [Solidity - Contracts](https://www.tutorialspoint.com/solidity/solidity_contracts.htm)
- [Solidity - Constructors](https://www.tutorialspoint.com/solidity/solidity_constructors.htm)
- [Solidity - Events](https://www.tutorialspoint.com/solidity/solidity_events.htm)

___

##### What are the differences between intX and uintX in Solidity with (for example) X = 256 ?

_`uint256 (uint is an alias)`_ is a unsigned integer which has:

- minimum value of 0
- maximum value of 2^256-1 = 115792089237316195423570985008687907853269984665640564039457584007913129639935 `(78 decimal digits)`

_`int256 (int is an alias)`_ is a signed integer which has:

- minimum value of -2^255 = -57896044618658097711785492504343953926634992332820282019728792003956564819968
- maximum value of 2^255-1 = 57896044618658097711785492504343953926634992332820282019728792003956564819967

___ 

##### Why do Solidity examples use bytes32 type instead of string ? (We follow the same pattern)

Two main reasons:

- Contracts currently [cannot read a string](https://ethereum.stackexchange.com/questions/3727/contract-reading-a-string-returned-by-another-contract/3788#3788) that's returned by another contract.
- The [EVM has a word-size of 32 bytes](https://ethereum.stackexchange.com/questions/2327/clarification-of-256-bit-word-semantics), so it is "optimized" for dealing with data in chunks of 32 bytes. (Compilers, such as Solidity, have to do more work and generate more bytecode when data isn't in chunks of 32 bytes, which effectively leads to higher gas cost.)

[More details](https://ethereum.stackexchange.com/questions/11556/use-string-type-or-bytes32)

> In order to convert strings to bytes32, we use the _web3.utils.fromAscii(myString)_ function.

#### 4. General remarks on the tests.

Your tests should exist in the `./test` directory, they should end with a `.js` extension.

You will find all the information you need [here](https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript).

___ 

The `test` folder contain six files :

- adminMultisigTests.js, testing `Admin Multisig` contract.
- minterMultisigTests.js, testing `Minter Multisig` contract.
- ownerMultisigTests.js, testing `Owner Multisig` contract.
- reserveMultisigTests.js, testing `Reserve Multisig` contract.
- stablecoinMultisigTests.js, testing `Stablecoin Multisig` contract.
- exceptions.js, this file contains the modules allowing the `error management` of our test files.

###### Specifying tests

You can limit the tests being executed to a specific file as follows :

```
truffle test ./test/myTestFile.js
```

> Be careful, you must be in the `stablecoin` folder to execute the command above.

###### Provide Error Issue

If you try to run all the tests at once with the command `truffle test` you will get the following error :

```
  ProviderError: 
Could not connect to your Ethereum client.
Please check that your Ethereum client:
    - is running
    - is accepting RPC connections (i.e., "--rpc" option is used in geth)
    - is accessible over the network
    - is properly configured in your Truffle configuration file (truffle-config.js)
```
**Why ?** After a certain execution time the connection to the node is interrupted for security reasons. 

> Which is why we recommend that you specify the file to be tested to avoid this error.

###### ExtendableError: Could not find suitable configuration file.

If you run `truffle test` in the wrong folder, you will have the following error : 

```
ExtendableError: Could not find suitable configuration file.
    at Function.detect ($PATH\npm\node_modules\truffle\build\webpack:\packages\config\dist\index.js:148:1)
    at Object.run ($PATH\npm\node_modules\truffle\build\webpack:\packages\core\lib\commands\test\index.js:132:1)
    at Command.run ($PATH\npm\node_modules\truffle\build\webpack:\packages\core\lib\command.js:136:1)
    at Object.<anonymous> ($PATH\npm\node_modules\truffle\build\webpack:\packages\core\cli.js:56:1)
    at __webpack_require__ ($PATH\npm\node_modules\truffle\build\webpack:\webpack\bootstrap:19:1)
    at $PATH\npm\node_modules\truffle\build\webpack:\webpack\bootstrap:83:1
    at Object.<anonymous> ($PATH\npm\node_modules\truffle\build\cli.bundled.js:89:10)
    at Module._compile (internal/modules/cjs/loader.js:1063:30)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:1092:10)
    at Module.load (internal/modules/cjs/loader.js:928:32)
    at Function.Module._load (internal/modules/cjs/loader.js:769:14)
    at Function.executeUserEntryPoint [as runMain] (internal/modules/run_main.js:72:12)
    at internal/main/run_main_module.js:17:47
Truffle vx.x.xx (core: x.x.xx)
Node vxx.xx.x
```
> This error means that Truffle couldn't find the suitable configuration file, make sure to be in the _$PATH/eth-stable-coin/stablecoin_ folder.

#### 5. Deployment of the Eth LughCoin on the Rinkeby testnet.

Finally you can deploy your contracts on the network ! 


###### Dotenv

Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env. Storing configuration in the environment separate from code is based on The Twelve-Factor App methodology.

```
npm install dotenv
```

> Create a .env file in the root directory of your project. Add environment-specific variables on new lines in the form of NAME=VALUE. For our example:

mnemonic = '.... .... .... ....'

infuraPubKey = '....................'

Its data is confidential and the user would not want to share it in the public eye. 


###### Deploy

> To deploy we will use the signature below.

```
truffle migrate [--reset] [--f <number>] [--to <number>] [--network <name>]
```
--reset: Run all migrations from the beginning, instead of running from the last completed migration.

--f <number>: Run contracts from a specific migration. The number refers to the prefix of the migration file.

--to <number>: Run contracts to a specific migration. The number refers to the prefix of the migration file.

--network <name>: Specify the network to use, saving artifacts specific to that network. Network name must exist in the configuration.

You will find all the information you need [here](https://www.trufflesuite.com/docs/truffle/reference/truffle-commands#migrate).


In our case, we will deploy the contracts on the rinkeby network. In addition, we need to deploy the first 3 contracts (minter, admin, owner) since we need to use their contract addresses in the stablecoin contract.

```
truffle migrate --f 1 --to 4 --network rinkeby
```

If you have this message : Compiling your contracts...

===========================

Everything is up to date, there is nothing to compile.

Network up to date.
Network up to date.

You can add --reset to run all migrations from the beginning 

```
truffle migrate --reset --f 1 --to 4 --network rinkeby
```

Add the addresses of minter, owner and administrator contracts in  stablecoin/migrations/6_stablecoin_migration.js and run the deploy of the rest.

```
truffle migrate --reset --f 5 --to 6 --network rinkeby
```



Congratulations you've made a success of your deployment! :clap: :rocket:
