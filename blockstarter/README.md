# Blockstarter

## Getting Started

Make sure you have installed Docker.

Go to directory /blockstarter and run:
```
docker-compose up --build
```

to run TestRPC (Port: 8545) and the middleware (Port: 8080).

## Endpoints

### Greeter-Endpoints:

* POST /greeters (Create a greeter contract) <br /><br /> 
Params: None <br />
Body : greeting <br />
Example: <br />
```JSON
{
    "greeting" : "Hello"
}
```
* GET /greeters/:address (Get greeter contract by address) <br /><br />
Params: contract address <br />
Body : None <br />

* PUT /greeters/:address (Update greeter contract by address)<br /><br />
Params: contract address <br />
Body : greeting <br />
Example: <br />
```JSON
{
    "greeting" : "Hello2"
}
```
* DELETE /greeters/:address (Delete greeter contract) <br /><br />
Params: contract address <br />
Body : none <br />

## Smart Contract Development Workflow

### 1. Change Solidity Contract

I would recommend for now to use the [Solidity Browser](https://ethereum.github.io/browser-solidity/) as IDE for smart contract development. It compiles automatically (you can turn it off if you want) and always tells you, if you have some Errors in the code. 

### 2. Update ABI and Bytecode in Middleware

Changes in the contract in the directory `/contracts` do not have any effects. You need to update the ABI and the Bytecode in the corresponding model to see the effects. E.g. the corresponding model for the Greeter contract is in `/models/greeter.js`. 

In order to get the ABI and the Bytecode you need to go to the `Solidity Browser --> Compile --> Details`. A Dialog will appear and you can copy the ABI and the Bytecode and replace the ones in the model (I have marked ABI and Bytecode with a comment line).

### 3. Extend Model

If you have added additional functions to the contract, you need to call it somehow with your middleware. Here you should use the web3 framework to call those functions in the smart contract. How to call the differentm smart contract functions is described in the [web3 documentation](https://web3js.readthedocs.io/en/1.0/index.html). You should create functions and make them publicly available in order to use them in you Routes (see examples).

### 4. Extend API/Routes

After creating additional functions in the model, you need to create additional routes in order to test your solidity function via web interface. The corresponding routes for the model Greeter are in `routes/greeters.js`.

