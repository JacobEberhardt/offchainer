// Required version
pragma solidity ^0.4.17;

contract Financials {

	// Variables
	address creator;
	uint private recordIndex = 0;

	//recordIndex counter mapping to root hashes of rows
	mapping(uint => bytes32) recordIndexToRootHashes;

	bytes32 rootHashAllRows;

	// Events
	event IntegrityCheckCompletedEvent(bool success, string resultOfIntegrityCheck, uint scIndex);
	event PostAppendEvent(uint indexInSmartContract, bytes32 rootHash);
	event QueryResultsEvent(bool[] resultIndexes);

	// Constructor
	/**
	 * Create a new contract instance.
	 *
	 */
	function Financials() public {
	    creator = msg.sender;
	}

	//Public functions

	/**
	 * Check the integrity of a given row against its stored hash by using the index generated by the Smart Contract.
	 *
	 * @param scIndex index generated by the Smart Contract for that row
	 * @param rootHashToVerify the row's root hash to compare to the stored one
	 * @return bool: true if rootHashToVerify equals the stored hash for that row
	 */
	function checkRowRootHash(uint scIndex, bytes32 rootHashToVerify) constant public returns(bool){
	    if(recordIndexToRootHashes[scIndex] == rootHashToVerify){
	        return true;
	    }
	    else{
	        return false;
	    }
	}

	/**
	 * Check the integrity of a given row's data against its stored hash by using the index generated by the Smart Contract.
	 * This function fires the event IntegrityCheckCompletedEvent.
	 *
	 * @param scIndex index generated by the Smart Contract for that row
	 * @param rowDataToVerify the row's data to verify
	 * @param proof Merkle proof
	 * @param _proofPosition positions of provided proof to work
	 */
	function checkRowData(uint scIndex, uint rowDataToVerify, bytes32[] proof, uint[] _proofPosition) public {
	    bytes32 resultingRootHash = _createTree(rowDataToVerify, proof, _proofPosition);
	    if(recordIndexToRootHashes[scIndex] == resultingRootHash){
	        IntegrityCheckCompletedEvent(true, "Success: Data of Row with the following index verified!", scIndex);
	    }
	    else{
	        IntegrityCheckCompletedEvent(false, "Failed: Data of Row with the following index could not be verified!", scIndex);
	    }
	}

	/**
	 * Check the integrity of all rows, i.e. the whole table, against the stored hashes.
	 *
	 * @param roothashesToVerify all the rows' hashes to verify
	 * @return bool: true if roothashesToVerify equal the stored hashes
	 */
	function checkAllRows(bytes32[] roothashesToVerify) constant public returns(bool){
	    for(uint i = 0; i < recordIndex; i++){
	        if(recordIndexToRootHashes[i] != roothashesToVerify[i]){
	            return false;
	        }
	    }
	    return true;
	}

	/**
	 * Check the integrity of several rows against the stored hashes using the index generated by the Smart Contract.
	 *
	 * @param scIndexesOfRowsToVerify indexes generated by the Smart Contract of the rows to verify
	 * @param roothashesToVerify the rows' hashes to verify
	 * @return bool: true if roothashesToVerify equal the stored hashes
	 */
	function checkSeveralRows(uint[] scIndexesOfRowsToVerify, bytes32[] roothashesToVerify) constant public returns(bool){
	    assert(scIndexesOfRowsToVerify.length == roothashesToVerify.length);
	    for(uint i = 0; i < scIndexesOfRowsToVerify.length; i++){
	        if(recordIndexToRootHashes[scIndexesOfRowsToVerify[i]] != roothashesToVerify[i]){
	            return false;
	        }
	    }
	    return true;
	}

	/**
	 * Adds the root hash of a new row to the Smart Contract. Concat hashes, and
	 * then return the new ID, and give roothash back to middleware
	 *
	 * @param roothashToAppend root hash of the row to append
	 * @return uint: the index generated by the Smart Contract for the new row
	 */
	function append(bytes32 roothashToAppend) public {
	    recordIndexToRootHashes[recordIndex] = roothashToAppend;

	    calcConcatHash();

	    recordIndex ++;
	    PostAppendEvent(recordIndex -1, roothashToAppend);
	}

	/**
	 * Adds the root hash of a new row to the Smart Contract after checking the integrity of all existing rows.
	 *
	 * @param roothashesToVerify all the rows' hashes to verify
	 * @param roothashToAppend root hash of the row to append
	 * @return uint: the index generated by the Smart Contract for the new row
	 */
	function appendWithCheck(bytes32[] roothashesToVerify, bytes32 roothashToAppend) public {
	    if(checkAllRows(roothashesToVerify)){
	        recordIndexToRootHashes[recordIndex] = roothashToAppend;

	        calcConcatHash();

	        recordIndex ++;
	        PostAppendEvent(recordIndex -1, roothashToAppend);
	    }

	}

	/**
	 * Query functionality: checks which entries lie within a specified range of dates.
	 * Fires the event QueryResultsEvent.
	 *
	 * @param rootHashArr array with all the rows' hashes to verify
	 * @param dateArr array with all the rows' creation dates
	 * @param max the maximal data as specified by the user's query
	 * @param min the minimum data as specified by the user's query
	 */
	function queryWithDate(bytes32[] rootHashArr, uint256[] dateArr, uint256 max, uint256 min) public {
	    assert(rootHashArr.length == dateArr.length);
	    assert(min <= max);

	    bool[] memory resultIndexes = new bool[](rootHashArr.length);

	    for(uint i = 0; i < rootHashArr.length; i++){
	        if(rootHashArr[i] == recordIndexToRootHashes[i]){
	            if((dateArr[i] >= min) && (dateArr[i] <= max)){
	                resultIndexes[i] = true;
	            }
	            else{
	                resultIndexes[i] = false;
	            }
	        }
	        else{
	            resultIndexes[i] = false;
	        }
	    }
	    QueryResultsEvent(resultIndexes);
	}

	// Private functions

	//hashes an array with all the rows' stored root hashes and stores the result
	function calcConcatHash() private {
	    bytes32[] memory arrayRowHashes = createRowsArray();
	    rootHashAllRows = keccak256(arrayRowHashes);

	}

	// creates an array with all the rows' stored root hashes
	function createRowsArray() private constant returns(bytes32[]){
	    bytes32[] memory arrayRowHashes = new bytes32[](recordIndex + 1);
	    for(uint i = 0; i < arrayRowHashes.length; i++){
	        arrayRowHashes[i] = recordIndexToRootHashes[i];
	    }
	    return arrayRowHashes;
	}

	//creates the Merkle Proof and returns the result
	function _createTree(uint rowDataToVerify, bytes32[] _proof, uint[] _proofPosition) pure private returns (bytes32) {
	    bytes32 computedHash = keccak256(rowDataToVerify);
	    for(uint8 i = 0; i < _proof.length; i++) {
	        if(_proofPosition[i] == 0) {
	            // if left
	            computedHash = keccak256(_proof[i], computedHash);
	        } else {
	            // if right
	            computedHash = keccak256(computedHash, _proof[i]);
	        }
	    }
	    return computedHash;
	}
}
