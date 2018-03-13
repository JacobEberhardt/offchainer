# Offchainer
A system for trustless data exchange between Smart Contract and RDBMS.

## Prerequisites
- [Docker](https://docs.docker.com/install/) 17.05 or higher
- [npm](https://docs.npmjs.com/getting-started/installing-node) 17.05 or higher
- [Postman](https://www.getpostman.com/apps) 17.05 or higher (optional)

## Deployment
### Source
Obtain a copy of the source code by cloning this repository
```
git clone https://github.com/simonfall/offchainer.git && cd offchainer
```

### Core System
Build and run our system with
```
npm run staging
```
The client-side application now listens over HTTP on port 8000 of the local machine (http://127.0.0.1:8000). To exit, simply press ```Ctrl``` + ```C```.

### Predefined API Requests
We provide Postman collections, which contain predefined requests for our use cases. To test a use case, import (File → Import) the desired JSON file from the ```postman``` directory to the Postman application and send the intended requests.

### Benchmarking
To run the benchmarking, execute
```
npm run benchmarking
```
The resulting statistics are written to CSV files in the ```benchmarking-results``` directory.

### Unit Tests
To run the unit tests, execute
```
npm run testing
```
An overview of the passed an failed test cases is shown.

### Translator
The Translator can be used by running
```
npm run translate <path to contract file>
```
or an example contract can be translated with
```
npm run translate translator/examples/counters.sol
```
The off-chained contract is written to the ```translator-output``` directory.
