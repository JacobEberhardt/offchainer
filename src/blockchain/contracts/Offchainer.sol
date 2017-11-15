// Required version
pragma solidity ^0.4.17;

// Import dependencies
import './Standard.sol';

contract Offchainer is Standard {
	
	// Declare variables
	string message; // The message to use in the contract
	bytes32 integrityHash; // The hash used for the integrity check

	// Define public functions 
	function Offchainer() public {
		// Initialize
	}

	/**
	 * Set the message to the given string.
	 *
	 * @param _message The given string.
	 * @return The hash of the given string.
	 */
	function setMessage(string _message) public returns (bytes32) {
		return _setMessage(_message);
	}

	/**
	 * Get the stored message.
	 *
	 * @return The stored message
	 */
	function getMessage() public constant returns (string) {
		return message;
	}

	/**
	 * Perform an integrity check on the given string.
	 *
	 * @param _message The string to check
	 * @return Whether the integrity check was successful
	 */
	function checkMessage(string _message) public constant returns (bool) {
		return _checkIntegrity(_message);
	}

	// Define private functions 
	/**
	 * Compute the hash of a given string.
	 *
	 * @param _message The string to compute the hash for
	 * @return The computed hash
	 */
	function _computeHash(string _message) private constant returns (bytes32) {
		return keccak256(_message);
	}

	/**
	 * Check the integrity of a given string against the stored hash.
	 *
	 * @param _message The string to check
	 * @return Whether the integrity check succeed
	 */
	function _checkIntegrity(string _message) private constant returns (bool) {
		return _computeHash(_message) == integrityHash;
	}

	/**
	 * Set the stored message to the given string.
	 *
	 * @param _message The string to store
	 * @return The hash for the given message
	 */
	function _setMessage(string _message) private returns (bytes32) {
		integrityHash = _computeHash(_message); // Compute the hash for the new message
		message = _message; // Store the new message
		return integrityHash; // Return the new hash
	}

}
