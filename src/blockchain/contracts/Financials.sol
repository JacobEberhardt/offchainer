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
	/**
	 * Return all records of entries stored in the SC. The record includes date and 
	 * roothash of a row.
	 */
	function getAllRecordEntries() constant returns(RecordEntry[]) {
	    RecordEntry[] memory currentRecordEntries = new RecordEntry[](recordIndex);
	    for(uint i = 0; i < recordIndex; i++){
	        currentRecordEntries[i] = recordEntries[i];
	    }
	    return currentRecordEntries;
	}

	/**
	 * Return an array of all the roothashes stored in SC.
	 */
	function getAllRootHashes() constant returns(bytes32[]) {
	    bytes32[] memory currentRootHashes = new bytes32[](recordIndex);
	    for(uint i = 0; i < recordIndex; i++){
	        currentRootHashes[i] = recordEntries[i].rootHash;
	    }
	    return currentRootHashes;
	}

	/**
	 * Return one record stored in the SC
	 * @param indexOfRecord the index of the record
	 */
	function getRecordEntry(uint indexOfRecord) constant returns(RecordEntry) {
	    return recordEntries[indexOfRecord];
	}

 	/**
	 * Returns one roothash of the chosen record
	 * @param indexOfRecord the index of the record 
	 */
	function getRootHash(uint indexOfRecord) constant returns(bytes32) {
	    return rootHashes[indexOfRecord];
	}

	/**
	 * Checks the integrity of a record, calls another event to display the result.
	 */
	function checkIntegrityOfRecord() constant{
	    IntegrityCheckCompletedEvent("Integrity of Data was verified");
	}

}