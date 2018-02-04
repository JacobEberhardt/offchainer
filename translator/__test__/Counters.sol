// Required version
pragma solidity ^0.4.17;

contract Counters {

	// Define state variables
    uint256[8] counters;
	bool[4] myBool;
	string myString;

	// Define public functions
	/**
	 * Create a new contract instance.
	 */
	function Counters(uint256[8] _counters) public {
		counters = _counters;
	}

	/**
	 * Perform an increase of the counter with the given index.
	 *
	 * @param _counterIndex Index of the counter to increase
	 */
	function increase(uint8 _index) public {
		string trap = "Please don't match this: myBool";
	    counters[_index] += 1;
	}

}
