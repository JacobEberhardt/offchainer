pragma solidity ^0.4.17;

contract OffChainer {
    address owner;
    uint largeData;
    bytes32 hashedLargeData;
    uint transactionTriggerer = 0; //https://ethereum.stackexchange.com/questions/27926/constant-function-creating-event
    // potentially need 2 contracts: https://ethereum.stackexchange.com/questions/24961/dealing-with-events-from-other-contracts

    event OffChainDataRequest(string dataToBeOffChained);
    event OnChainDataRequest(string dataToBeOnChained);
    // filter events: https://docs.web3j.io/filters.html
    //https://ethereum.stackexchange.com/questions/26117/web3-event-filtering-timeout

    function OffChainer(uint dataForContract) public {
        //uint 0 is used as null value here
        assert(dataForContract != 0);

        owner = msg.sender;
        largeData = dataForContract;

        offChainData();
    }

    function offChainData() private{
        OffChainDataRequest("largeData");
        //hash data and store hash for later integrity check
        hashedLargeData = keccak256(largeData); //https://ethereum.stackexchange.com/questions/2632/how-does-soliditys-sha3-keccak256-hash-uints
        //helper transaction so event is fired
        transactionTriggerer++;
    }

    function onChainData() private{
        OnChainDataRequest("largeData");
        //helper transaction so event is fired
        transactionTriggerer++;
    }

    function workWithData() public{
        if(largeData == 0){
            onChainData();
        }
        while(largeData == 0){
            //wait until DB provided data (with provideData())
        }
        // integrity check: compute hash and check that it is the same as when stored
        bytes32 hashedOnChainedData = keccak256(largeData);
        assert(hashedOnChainedData == hashedLargeData);

        //work with the data
        largeData = largeData +1;
        if(largeData == 0){
            largeData = largeData +1;
        }

        //update the data in DB
        offChainData();
    }

    function getData() constant public returns(uint){
        return largeData;
    }
    //after DB got data with getData() this function has to be called and largeData has to be set to 0 (save storage space)
    function setData() public{
        largeData = 0;
    }

    function provideData(uint dataToOnChain) public{
        largeData = dataToOnChain;
    }

    function kill() public{
    if (msg.sender == owner) {
        selfdestruct(owner); //should return 0 value
    }
  }
}
