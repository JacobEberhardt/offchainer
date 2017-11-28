// Required version
pragma solidity ^0.4.17;

import "./PayRaise.sol";

contract Employee {
	
	// Variables
	address creator;
	mapping(uint => bytes32) employeeRootHashes;
	
	// Events
	event RetrieveDataEvent(bytes32 department, bytes32 fromEntryDate);
	event TransactionCompletedEvent();

	// Constructor
	/**
	 * Create a new contract instance.
	 * 
	 */
	function Employee() public {
	    creator = msg.sender;
	}
	
	// Public functions
	/**
	 * Adds the root hash of an employee record to employeeRootHashes mapping.
	 *
	 * @param _index The index of the employee in the database
	 * @param _rootHash The root hash of the merkle tree of the employee record
	 */
	function add(uint8 _index, bytes32 _rootHash) public {
		employeeRootHashes[_index] = _rootHash;
	}

	/**
	 * Updates the root hash of an employee record
	 *
	 * @param _index The index of the employee record
	 * @param _rootHash The new root hash of the employee record 
	 */
	function update(uint8 _index, bytes32 _rootHash) public {
		employeeRootHashes[_index] = _rootHash;
	}

		/**
	 * Initializes the operation to raise the salary of affected employees (depending on departmen and entry date)
	 * Function trigges Event and passes department and fromEntryDate
	 *  
	 */
	function increaseSalary(address _payRaiseContract) public {
		PayRaise c = PayRaise(_payRaiseContract);
	    bytes32 department = c.getDepartment();
	    bytes32 beforeStartdate = c.getBeforeStartDate();
	    RetrieveDataEvent(department, beforeStartdate);
	}
	
	// Private functions

}
