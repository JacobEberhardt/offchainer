// Required version
pragma solidity ^0.4.17;

contract CounterOnchain {

    uint256 public counter_one;
    uint256 public counter_two;
    uint256 public counter_three;
    uint256 public counter_four;

	// Define public functions
	/**
	 * Create a new contract instance.
	 */
	function CounterOnchain(uint256 _counter_one, uint256 _counter_two,
	    uint256 _counter_three, uint256 _counter_four) public {
		    counter_one = _counter_one;
        counter_two = _counter_two;
        counter_three = _counter_three;
        counter_four = _counter_four;
	}

	/**
	 * Perform an increase of the counter with the given index.
	 *
	 * @param _counterValue value of the counter in int
	 * @param _counterIndex index of the counter variable
	 */
	function doCounterIncrease(uint256 _counterValue, uint8 _counterIndex) public {
	    if(_counterIndex == 0){
	        counter_one += _counterValue;
	    }
	    else if(_counterIndex == 1){
	        counter_two += _counterValue;
	    }
	    else if(_counterIndex == 2){
	        counter_three += _counterValue;
	    }
	    else if(_counterIndex == 3){
	        counter_four += _counterValue;
	    }
	}
}
