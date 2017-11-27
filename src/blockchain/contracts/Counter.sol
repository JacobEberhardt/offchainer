// Required version
pragma solidity ^0.4.17;

contract Counter {
	
	// Declare variables
	string integrityHash; // The integrity hash of the counters array

	// Declare events
	event RequestedCounterIncreaseEvent(string integrityHash);
	event IntegrityCheckFailedEvent();
	event CounterIncreasedEvent(uint8[4] counters);

	// Define public functions 
	/**
	 * Create a new contract instance.
	 */
	function Counter(string _rootHash) public {
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
	 * @param _counterHash The keccak hash of the counter value
	 * @param _counterValue value of the counter in int
	 * @param _proof proof
	 * @param _proofPosition proof positions
	 */
	function doCounterIncrease(string _counterHash, uint8 _counterValue, byte[64][] _proof, uint[] _proofPosition) public {
	    //do integrityCheck here for proof and merkle tree
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
// 	function _checkIntegrity(uint8[4] _counters) private constant returns (bool) {
// 		if (integrityHash == 0) return false;
// 		return _computeHash(_counters) == integrityHash;
// 	}

}
