// Required version
pragma solidity ^0.4.17;

contract CounterMultiple {

	// Declare variables
	mapping(uint => bytes32) integrityHashes; // The integrity hashes of the counters array

	// Declare events
	event IntegrityCheckFailedEvent();
	event IntegrityCheckFailedEvent2(bytes32 proof1,bytes32 proof2);
	event ReturnNewRootHash(bytes32 proof, uint newCounterValue);
	event RequestSingleDataEvent(uint rowId, uint colId);
	

	// Define public functions
	/**
	 * Create a new contract instance.
	 */
	function Counter() public {

	}

	/**
	 * Adds the root hash of a counter record to integrityHashes mapping.
	 *
	 * @param _index The index of the counter in the database
	 * @param _rootHash The root hash of the merkle tree of the counter record
	 */
	function add(uint _index, bytes32 _rootHash) public {
		integrityHashes[_index] = _rootHash;
	}

	function getRootHash(uint _index) constant public returns (bytes32) {
		return integrityHashes[_index];
	}

	/**
	 * Request the increase of the counter with the given index.
	 *
	 * @param _rowId The index of the row of counter
	 * @param _colId The index of the column of the counter to increase (zero-based)
	 */
	function requestSingleCounterIncrease(uint _rowId, uint _colId) public {
		RequestSingleDataEvent(_rowId, _colId);
	}

	/**
	 * Perform an increase of the counter with the given index.
	 * @param _rowId Index of the counter record
	 * @param _counterValue value of the counter in int
	 * @param _proof proof
	 * @param _proofPosition proof positions
	 */
	function doSingleCounterIncrease(uint _rowId, uint8 _counterValue, bytes32[] _proof, uint[] _proofPosition) public {
	    //Perform integrity check by reconstrcuting the merkle tree.
	    bytes32 computedHash = _createTree(_counterValue, _proof, _proofPosition);

        if (computedHash == integrityHashes[_rowId]) {
            uint8 newCounterValue = _counterValue + 1;
            // get new roothash after increasing the counter
            integrityHashes[_rowId] = _createTree(newCounterValue, _proof, _proofPosition);
            ReturnNewRootHash(integrityHashes[_rowId], newCounterValue);
        } else {
			IntegrityCheckFailedEvent2(integrityHashes[_rowId], computedHash);
        }
	}

	/**
	 * Check the integrity of a given array of integers against the stored hash.
	 *
	 * @param _counterValue value of the counter in int
	 * @param _proof proof
	 * @param _proofPosition proof positions
	 * @return the newly computed hash
	 */
	function _createTree(uint8 _counterValue, bytes32[] _proof, uint[] _proofPosition) private returns (bytes32) {
	    bytes32 computedHash = keccak256(_counterValue);
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
