// Required version
pragma solidity ^0.4.17;

// Import dependencies
import './Standard.sol';

contract Offchainer is Standard {
	
	// Declare variables
	string message; // The message to use in the contract
	bytes32 integrityHash; // The hash used for the integrity check

	// Define public methods
	/**
	 * @constructor
	 */
	function Offchainer(string _message) public returns (bytes32) {
		return _setMessage(_message); // Set the initial message
	}

	/**
	 * Get the stored message.
	 * @returns {string} The stored message
	 */
	function getMessage() constant public returns (string) {
		return message;
	}

	/**
	 * Perform an integrity check on the given string.
	 * @param {string} _message The string to check
	 * @returns {bool} Whether the integrity check was successful
	 */
	function checkMessage(string _message) constant public returns (bool) {
		return _checkIntegrity(_message);
	}

	// Define private methods
	/**
	 * Compute the hash of a given string.
	 * @param {string} _message The string to compute the hash for
	 * @returns {bytes32} The computed hash
	 */
	function _computeHash(string _message) constant returns (bytes32) {
		return keccak256(_message);
	}

	/**
	 * Check the integrity of a given string against the stored hash.
	 * @param {string} _message The string to check
	 * @returns {bool} Whether the integrity check succeed
	 */
	function _checkIntegrity(string _message) constant returns (bool) {
		return _computeHash(_message) == integrityHash;
	}

	/**
	 * Set the stored message to the given string.
	 * @param {string} _message The string to store
	 * @returns {bytes32} The hash for the given message
	 */
	function _setMessage(string _message) returns (bytes32) {
		integrityHash = _computeHash(_message); // Compute the hash for the new message
		message = _message; // Store the new message
		return integrityHash; // Return the new hash
	}

}
