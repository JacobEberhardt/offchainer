// Required version
pragma solidity ^0.4.17;

contract owned {

	// Declare variables 
	address owner; // The owner of the contract

	// Define public functions 
	function owned() public {
		owner = msg.sender; // Store the address of the sender as owner
	}

	/**
	 * Get the owner of the contract.
	 *
	 * @return The address of the contract's owner
	 */
	function getOwner() public constant returns (address) {
		return owner;
	}
	
}

contract mortal is owned{

	/**
	 * Kill the contract and send funds to owner.
	 */
	function kill() public {
		if(msg.sender == owner) {
			selfdestruct(owner); // Destroy this contract and send funds to address stored in owner
		}
	}

}

contract Standard is mortal {

	/**
	 * Fallback function.
	 */
	function () public payable {}

}
