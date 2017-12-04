// Required version
pragma solidity ^0.4.17;

contract Financials {

	// Variables
	address creator;
	uint private recordIndex = 0;
	mapping(uint => RecordEntry) recordEntries;
	mapping(uint => bytes32) datesToHashes;

	mapping(uint => bytes32) rootHashes;

	struct RecordEntry {
        uint date;
        bytes32 rootHash;
    }

	// Events
	event IntegrityCheckCompletedEvent(string resultOfIntegrityCheck);

	// Constructor
	/**
	 * Create a new contract instance.
	 *
	 */
	function Financials() public {
	    creator = msg.sender;
	}

	// Public functions
	/**
	 * Adds a new record entry to recordEntries mapping.
	 * @param _index The index of the record entry
	 * @param _rootHash The root hash of the merkle tree of the record entry
	 */
	function addRecordEntry(uint _index, bytes32 _rootHash) public {
	    // datesToHashes[now] = _rootHash;
	    // RecordEntry memory recordEntry = RecordEntry(now, _rootHash);
		// recordEntries[recordIndex] = recordEntry;
		// recordIndex++;
		rootHashes[_index] = _rootHash;
	}

	function getAllRecordEntries() constant returns(RecordEntry[]) {
	    RecordEntry[] memory currentRecordEntries = new RecordEntry[](recordIndex);
	    for(uint i = 0; i < recordIndex; i++){
	        currentRecordEntries[i] = recordEntries[i];
	    }
	    return currentRecordEntries;
	}

	function getAllRootHashes() constant returns(bytes32[]) {
	    bytes32[] memory currentRootHashes = new bytes32[](recordIndex);
	    for(uint i = 0; i < recordIndex; i++){
	        currentRootHashes[i] = recordEntries[i].rootHash;
	    }
	    return currentRootHashes;
	}

	function getRecordEntry(uint indexOfRecord) constant returns(RecordEntry) {
	    return recordEntries[indexOfRecord];
	}

	function getRootHash(uint indexOfRecord) constant returns(bytes32) {
	    return recordEntries[indexOfRecord].rootHash;
	}

	function checkIntegrityOfRecord() constant{
	    //TODO
	    IntegrityCheckCompletedEvent("Integrity of Data was verified");

	    IntegrityCheckCompletedEvent("Integrity of Data could not be verified");
	}


	// Private functions

}
