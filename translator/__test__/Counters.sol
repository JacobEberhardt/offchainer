// Required version
pragma solidity ^0.4.17;

contract Counters {

	// Define state variables
    uint256[8] counters;
	bool myBool;
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
	function increase(uint8 _index, string unused) public returns {
		string trap = "Please don't match this: myBool";
		bool newBool = myBool;
	    counters[_index] += 1;
	}

}
