// Required version
pragma solidity ^0.4.17;

contract Counter {
	
	// Declare variables
	bytes32 integrityHash; // The integrity hash of the counters array

	// Declare events
	event requestIncreaseCounterEvent(uint8 index);
	event integrityCheckFailedEvent();
	event counterIncreasedEvent(uint8[4] counters);

	// Define public functions 
	/**
	 * Create a new contract instance.
	 */
	function Counter() public {
		uint8[4] memory zeroArr; // Memory array is automatically initialized to zeros
		integrityHash = _computeHash(zeroArr); // Compute the initial integrity hash
	}

	/**
	 * Request the increase of the counter with the given index.
	 *
	 * @param _index The index of the counter to increase (zero-based)
	 */
	function requestIncreaseCounter(uint8 _index) public {
		requestIncreaseCounterEvent(_index);	
	}

	/**
	 * Perform an increase of the counter with the given index.
	 *
	 * @param _counters The array of counters
	 * @param _index The index of the counter which should be increased (zero-based)
	 */
	function doIncreaseCounter(uint8[4] _counters, uint8 _index) public {
		if (!_checkIntegrity(_counters)) return integrityCheckFailedEvent(); // Run integrity check
		_counters[_index] += 1;
		counterIncreasedEvent(_counters);
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
	 * @param _counters The array of integers to check
	 * @return Whether the integrity check succeed
	 */
	function _checkIntegrity(uint8[4] _counters) private constant returns (bool) {
		if (integrityHash == 0) return false;
		return _computeHash(_counters) == integrityHash;
	}

}
