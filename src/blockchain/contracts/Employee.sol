// Required version
pragma solidity ^0.4.17;

import "./PayRaise.sol";

contract Employee {
	
	// Variables
	address creator;
	mapping(uint => bytes32) employeesRootHashes;
	PayRaise payRaiseContract;
	
	// Events
	event RetrieveDataEvent(bytes32 department, bytes32 fromEntryDate);
	event IntegrityCheckFailedEvent(uint rowId, bytes32 proof1, bytes32 proof2);
	event ReturnNewValues(uint rowId, bytes32 proof, uint newCounterValue);

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
	 * Adds the root hash of an employee record to employeesRootHashes mapping.
	 *
	 * @param _index The index of the employee in the database
	 * @param _rootHash The root hash of the merkle tree of the employee record
	 */
	function add(uint _index, bytes32 _rootHash) public {
		employeesRootHashes[_index] = _rootHash;
	}

	/**
	 * Updates the root hash of an employee record
	 *
	 * @param _index The index of the employee record
	 * @param _rootHash The new root hash of the employee record 
	 */
	function update(uint _index, bytes32 _rootHash) public {
		employeesRootHashes[_index] = _rootHash;
	}

	/**
	 * Revert to previous hash. A Rollback function.
	 */
	 function rollBack(uint _index, bytes32 _prevRootHash) public {
	    employeesRootHashes[_index] = _prevRootHash;
	 }
	

	/**
	 * Initializes the operation to raise the salary of affected employees (depending on departmen and entry date)
	 * Function trigges Event and passes department and fromEntryDate
	 * @param _payRaiseContractAddress The address of the payraise contract
	 */
	function requestIncreaseSalary(address _payRaiseContractAddress) public {
		payRaiseContract = PayRaise(_payRaiseContractAddress);
	    bytes32 department = payRaiseContract.getDepartment();
	    bytes32 beforeStartdate = payRaiseContract.getBeforeStartDate();
	    RetrieveDataEvent(department, beforeStartdate);
	}

	/**
	 *  Increases salary of a single employee.
	 * 
	 * @param _rowId The address of the payraise contract 
	 * @param _currentSalary The address of the payraise contract
	 * @param _proof The address of the payraise contract
	 * @param _proofPosition The address of the payraise contract
	 */
	function increaseSalarySingleEmployee(uint _rowId, uint _currentSalary, bytes32[] _proof, uint[] _proofPosition) public {
	    bytes32 computedHash = _createTree(_currentSalary, _proof, _proofPosition);
		uint percentage = payRaiseContract.getPercentage();
        if (computedHash == employeesRootHashes[_rowId]) {
            uint newSalary = _currentSalary + _currentSalary * percentage / 100;
            employeesRootHashes[_rowId] = _createTree(newSalary, _proof, _proofPosition);
            ReturnNewValues(_rowId, employeesRootHashes[_rowId], newSalary);
        } else {
			IntegrityCheckFailedEvent(_rowId, employeesRootHashes[_rowId], computedHash);
        }
	}
	
	// Private functions
	/**
	 * Check the integrity of a given array of integers against the stored hash.
	 *
	 * @param _counterValue value of the counter in int
	 * @param _proof proof
	 * @param _proofPosition proof positions
	 * @return the newly computed hash
	 */
	function _createTree(uint _counterValue, bytes32[] _proof, uint[] _proofPosition) private returns (bytes32) {
	    bytes32 computedHash = keccak256(_counterValue);
	    for (uint i = 0; i < _proof.length; i++) {
	        if (_proofPosition[i] == 0) {
	            // if left
	            computedHash = keccak256(_proof[i], computedHash);
	        } else {
	            // if right
	            computedHash = keccak256(computedHash, _proof[i]);
	        }
	    }
	    return computedHash;
	}
}
