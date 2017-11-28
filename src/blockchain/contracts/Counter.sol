// Required version
pragma solidity ^0.4.17;

contract Counter {
	
	// Declare variables
	bytes32 integrityHash; // The integrity hash of the counters array

	// Declare events
	event RequestedCounterIncreaseEvent(bytes32 integrityHash);
	event IntegrityCheckFailedEvent();
	event CounterIncreasedEvent(uint8[4] counters);
	event returnNewRootHash(bytes32 proof, uint8 newCounterValue);

	// Define public functions 
	/**
	 * Create a new contract instance.
	 */
	function Counter(bytes32 _rootHash) public {
		integrityHash = _rootHash;
	}

	/**
	 * Request the increase of the counter with the given index.
	 *
	 * @param _index The index of the counter to increase (zero-based)
	 */
	function requestCounterIncrease(uint8 _index) public {
		RequestedCounterIncreaseEvent(integrityHash);	
	}

	/**
	 * Perform an increase of the counter with the given index.
	 *
	 * @param _counterValue value of the counter in int
	 * @param _proof proof
	 * @param _proofPosition proof positions
	 */
	function doCounterIncrease(uint8 _counterValue, bytes32[] _proof, uint[] _proofPosition) public {
	    //Perform integrity check by reconstrcuting the merkle tree.
	    bytes32 computedHash = _createTree(_counterValue, _proof, _proofPosition);
	   
        if(computedHash == integrityHash) {
            uint8 newCounterValue = _counterValue + 1;
            // get new roothash after increasing the counter
            bytes32 newRootHash = _createTree(newCounterValue, _proof, _proofPosition);
            integrityHash = newRootHash;
            returnNewRootHash(integrityHash, newCounterValue);
        } else {
            IntegrityCheckFailedEvent();
        }
	}   

	// Define private functions 
	/**
	 * Compute the hash of a given array of integers.
	 *
	 * @param _counters The array of integers to compute the hash for
	 * @return The computed hash
	 */
	function _computeHash(uint8[4] _counters) private pure returns (bytes32 hash) {
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
