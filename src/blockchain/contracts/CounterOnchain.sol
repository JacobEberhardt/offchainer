// Required version
pragma solidity ^0.4.17;

contract CounterOnchain {

    uint256[64] counters;

	// Define public functions
	/**
	 * Create a new contract instance.
	 */
	function CounterOnchain(uint256[64] _counters) public {
		counters = _counters;
	}

	/**
	 * Perform an increase of the counter with the given index.
	 *
	 * @param _counterValue value of the counter in int
	 * @param _counterIndex index of the counter variable
	 */
	function doCounterIncrease(uint256 _counterValue, uint8 _counterIndex) public {
	    counters[_counterIndex] = _counterValue;
	}
}
