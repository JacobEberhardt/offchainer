// Required version
pragma solidity ^0.4.17;

contract Counter {

	// Declare variables
	bytes32 integrityHash; // The integrity hash of the counters array
	mapping(uint => bytes32) integrityHashes; // The integrity hashes of the counters array

	// Declare events
	event RequestedCounterIncreaseEvent(bytes32 integrityHash);
	event IntegrityCheckFailedEvent();
	event CounterIncreasedEvent(uint[4] counters);
	event returnNewRootHash(bytes32 proof, uint newCounterValue);
	event RequestSingleDataEvent(uint rowId, uint colId);
	event IntegrityCheckFailedEvent2(bytes32 proof1,bytes32 proof2);

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
	 * @param _index The index of the counter to increase (zero-based)
	 */
	function requestCounterIncrease(uint _index) public {
		RequestedCounterIncreaseEvent(integrityHash);
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
	 *
	 * @param _counterValue value of the counter in int
	 * @param _proof proof
	 * @param _proofPosition proof positions
	 */
	function doCounterIncrease(uint _counterValue, bytes32[] _proof, uint[] _proofPosition) public {
	    //Perform integrity check by reconstrcuting the merkle tree.
	    bytes32 computedHash = _createTree(_counterValue, _proof, _proofPosition);

        if(computedHash == integrityHash) {
            uint newCounterValue = _counterValue + 1;
            // get new roothash after increasing the counter
            integrityHash = _createTree(newCounterValue, _proof, _proofPosition);
            returnNewRootHash(integrityHash, newCounterValue);
        } else {
            IntegrityCheckFailedEvent();
        }
	}

	/**
	 * Perform an increase of the counter with the given index.
	 * @param _rowId Index of the counter record
	 * @param _counterValue value of the counter in int
	 * @param _proof proof
	 * @param _proofPosition proof positions
	 */
	function doSingleCounterIncrease(uint _rowId, uint _counterValue, bytes32[] _proof, uint[] _proofPosition) public {
	    //Perform integrity check by reconstrcuting the merkle tree.
	    bytes32 computedHash = _createTree(_counterValue, _proof, _proofPosition);

        if(computedHash == integrityHashes[_rowId]) {
            uint newCounterValue = _counterValue + 1;
            // get new roothash after increasing the counter
            integrityHashes[_rowId] = _createTree(newCounterValue, _proof, _proofPosition);
            returnNewRootHash(integrityHashes[_rowId], newCounterValue);
        } else {
			IntegrityCheckFailedEvent2(integrityHashes[_rowId], computedHash);
        }
	}

	// Define private functions
	/**
	 * Compute the hash of a given array of integers.
	 *
	 * @param _counters The array of integers to compute the hash for
	 * @return The computed hash
	 */
	function _computeHash(uint[4] _counters) private pure returns (bytes32 hash) {
		return keccak256(_counters);
	}

	/**
	 * Check the integrity of a given array of integers against the stored hash.
	 *
	 * @param _counterValue value of the counter in int
	 * @param _proof proof
	 * @param _proofPosition proof positions
	 * @return the newly computed hash
	 */
	function _createTree(uint _counterValue, bytes32[] _proof, uint[] _proofPosition) private returns (bytes32) {
	    bytes32 computedHash = keccak256(_counterValue);

	    for(uint i = 0; i < _proof.length; i++) {
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
