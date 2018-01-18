// Required version
pragma solidity ^0.4.17;

contract Financials {

	// Variables
	address creator;
	uint private recordIndex = 0;

	//recordIndex counter mapping to root hashes of rows
	mapping(uint => bytes32) recordIndexToRootHashes;
	//recordIndex counter mapping to index in database
	mapping(uint => uint) recordIndexToDatabaseIndex;
	//index in database to mapping to root hashes of rows
	mapping(uint => bytes32) databaseIndexToRootHashes;

	bytes32 rootHashAllRows;
	bytes32 concatenatedRows;

	// Events
	event IntegrityCheckCompletedEvent(string resultOfIntegrityCheck);

	// Constructor
	/**
	 * Create a new contract instance.
	 *
	 */
	function Financials() public {
	    creator = msg.sender;
	    rootHashAllRows = 0;
	    concatenatedRows = 0;
	}


	function checkRowRootHashSCIndex(uint scIndex, bytes32 rootHashToVerify) constant public returns(bool){
	    if(recordIndexToRootHashes[scIndex] == rootHashToVerify){
	        return true;
	    }
	    else{
	        return false;
	    }
	}

	function checkRowRootHashDatabaseIndex(uint dbIndex, bytes32 rootHashToVerify) constant public returns(bool){
	    if(databaseIndexToRootHashes[dbIndex] == rootHashToVerify){
	        return true;
	    }
	    else{
	        return false;
	    }
	}

	function checkRowDataSCIndex(uint scIndex, uint[] rowDataToVerify) constant public returns(bool){
	    //TODO: perform Merkle Hashing on rowDataToVerify
	    bytes32 resultingRootHash = 0;
	    if(recordIndexToRootHashes[scIndex] == resultingRootHash){
	        return true;
	    }
	    else{
	        return false;
	    }
	}

	function checkRowDataDatabaseIndex(uint dbIndex, uint[] rowDataToVerify) constant public returns(bool){
	    //TODO: perform Merkle Hashing on rowDataToVerify
	    bytes32 resultingRootHash = 0;
	    if(databaseIndexToRootHashes[dbIndex] == resultingRootHash){
	        return true;
	    }
	    else{
	        return false;
	    }
	}

	function checkAllRows(bytes32[] roothashesToVerify) constant public returns(bool){
	    for(uint i = 0; i < recordIndex; i++){
	        if(recordIndexToRootHashes[i] != roothashesToVerify[i]){
	            return false;
	        }
	    }
	    return true;
	}

	function checkSeveralRowsSCIndex(uint[] scIndexesOfRowsToVerify, bytes32[] roothashesToVerify) constant public returns(bool){
	    assert(scIndexesOfRowsToVerify.length == roothashesToVerify.length);
	    for(uint i = 0; i < scIndexesOfRowsToVerify.length; i++){
	        if(recordIndexToRootHashes[scIndexesOfRowsToVerify[i]] != roothashesToVerify[i]){
	            return false;
	        }
	    }
	    return true;
	}

	function checkSeveralRowsDatabaseIndex(uint[] dbIndexesOfRowsToVerify, bytes32[] roothashesToVerify) constant public returns(bool){
	    assert(dbIndexesOfRowsToVerify.length == roothashesToVerify.length);
	    for(uint i = 0; i < dbIndexesOfRowsToVerify.length; i++){
	        if(databaseIndexToRootHashes[dbIndexesOfRowsToVerify[i]] != roothashesToVerify[i]){
	            return false;
	        }
	    }
	    return true;
	}

	function append(uint dbIndex, bytes32 roothashToAppend) public returns(uint){
	    recordIndexToRootHashes[recordIndex] = roothashToAppend;
	    recordIndexToDatabaseIndex[recordIndex] = dbIndex;
	    databaseIndexToRootHashes[dbIndex] = roothashToAppend;

	    calcConcatHash(roothashToAppend);

	    recordIndex ++;
	    return (recordIndex - 1);
	}

	function calcConcatHash(bytes32 roothashToAppend) private {
	    if(concatenatedRows != 0){
	        //concatenate concatenatedRows and roothashToAppend
	        //https://ethereum.stackexchange.com/questions/729/how-to-concatenate-strings-in-solidity
	        //https://ethereum.stackexchange.com/questions/1081/how-to-concatenate-a-bytes32-array-to-a-string
	        concatenatedRows = concatenatedRows & roothashToAppend; //not concatenated but added, should serve same cause
	        rootHashAllRows = keccak256(concatenatedRows);
	    }
	    else{
	        //first entry
	        concatenatedRows = roothashToAppend;
	        rootHashAllRows = keccak256(concatenatedRows);
	    }
	}
}
