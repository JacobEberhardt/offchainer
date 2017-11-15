// Required version
pragma solidity ^0.4.17;

contract owned {

	// Declare variables 
	address owner; // The owner of the contract

	/**
	 * @constructor
	 */
	function owned() {
		owner = msg.sender; // Store the address of the sender as owner
	}

	/**
	 * Get the owner of the contract.
	 * @returns {address} The address of the contract's owner
	 */
	function getOwner() constant public returns (address) {
		return owner;
	}
	
}

contract mortal is owned{

	/**
	 * Kill the contract and send funds to owner.
	 */
	function kill() {
		selfdestruct(owner); // Destroy this contract and send funds to address stored in owner
	}

}

contract Standard is mortal {

	/**
	 * Fallback function.
	 */
	function () payable {}

}
