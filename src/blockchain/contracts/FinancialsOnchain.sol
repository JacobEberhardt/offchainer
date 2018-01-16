// Required version
pragma solidity ^0.4.17;

contract Financials {

	// Variables
	address creator;
	uint private recordIndex = 0;
	mapping(uint => RecordEntry) recordEntries;
	//mapping(uint => bytes32) datesToHashes;

	//mapping(uint => bytes32) rootHashes;



	struct RecordEntry {
        uint256 date;
        string company_name;
		string recording_date;
		uint256 total_sales;
		uint256 cogs;
		uint256 inventory_stock;
		uint256 cash_counter;
		uint256 accounts_receivables;
	    uint256 accounts_payable;
    }

	// Events
	//event IntegrityCheckCompletedEvent(string resultOfIntegrityCheck);

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
	 *  _index The index of the record entry
	 *  _rootHash The root hash of the merkle tree of the record entry
	 */
	function addRecordEntry( uint256 date, string company_name, string recording_date, 
	uint256 total_sales, uint256 cogs, uint256 inventory_stock, uint256 cash_counter,
	uint256 accounts_receivables, uint256 accounts_payable) public {
	    // datesToHashes[now] = _rootHash;
	    // RecordEntry memory recordEntry = RecordEntry(now, _rootHash);
		// recordEntries[recordIndex] = recordEntry;
		// recordIndex++;
		
		recordEntries[recordIndex] = RecordEntry(date, company_name, recording_date,
		total_sales, cogs, inventory_stock, cash_counter, accounts_receivables, accounts_payable);
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
	/*function getAllRootHashes() constant returns(bytes32[]) {
	    bytes32[] memory currentRootHashes = new bytes32[](recordIndex);
	    for(uint i = 0; i < recordIndex; i++){
	        currentRootHashes[i] = recordEntries[i].rootHash;
	    }
	    return currentRootHashes;
	}*/

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
	function getRootHash(uint indexOfRecord) constant returns(string) {
	    return recordEntries[indexOfRecord].recording_date;
	}

	/**
	 * Checks the integrity of a record, calls another event to display the result.
	 */
	function checkIntegrityOfRecord() constant{
	    //TODO
	    //IntegrityCheckCompletedEvent("Integrity of Data was verified");
	}
}