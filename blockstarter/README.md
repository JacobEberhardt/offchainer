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
