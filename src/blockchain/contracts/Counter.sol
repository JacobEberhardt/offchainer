// Required version
pragma solidity ^0.4.17;

contract Counter {
	
	// Declare variables
	bytes32 integrityHash; // The integrity hash of the counters array

	// Declare events
	event RequestedCounterIncreaseEvent(uint8 index);
	event IntegrityCheckFailedEvent();
	event CounterIncreasedEvent(uint8[4] counters);

	// Define public functions 
	/**
	 * Create a new contract instance.
	 */
	function Counter(bytes32 rootHash) public {
		integrityHash = rootHash;
	}

	/**
	 * Request the increase of the counter with the given index.
	 *
	 * @param _index The index of the counter to increase (zero-based)
	 */
	function requestCounterIncrease(uint8 _index) public {
		RequestedCounterIncreaseEvent(_index);	
	}

	/**
	 * Perform an increase of the counter with the given index.
	 *
	 * @param _counters The array of counters
	 * @param _index The index of the counter which should be increased (zero-based)
	 */
	function doCounterIncrease(uint8[4] _counters, uint8 _index) public {
		if (!_checkIntegrity(_counters)) 
			return IntegrityCheckFailedEvent(); // Run integrity check
		_counters[_index] += 1;
		integrityHash = _computeHash(_counters);
		CounterIncreasedEvent(_counters);
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
