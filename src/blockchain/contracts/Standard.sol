// Required version
pragma solidity ^0.4.17;

contract owned {

	// Declare variables 
	address owner;

	/**
	 * @constructor
	 */
	function owned() {
		owner = msg.sender;
	}
	
}

contract mortal is owned{

	/**
	 * Kill the contract and send funds to owner.
	 */
	function kill() {
		selfdestruct(owner);
	}

}

contract Standard is mortal {

	/**
	 * Fallback function.
	 */
	function () payable {}

}
