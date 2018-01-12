// Required version
pragma solidity ^0.4.17;

import "./PayRaise.sol";

contract Employee {

	// Define constants
	uint8 constant SALARY_INDEX_OFFSET = 4;
	
	// Define variables
	address creator;
	mapping(uint => bytes32) employeesRootHashes;
	PayRaise payRaiseContract;
	
	// Define events
	event RetrieveDataEvent(bytes32 department, bytes32 fromEntryDate);
	event IntegrityCheckFailedEvent();
	event ReturnNewValues(uint rowId, bytes32 oldRoot, bytes32 newRoot, uint newSalary);

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

	function get(uint _index) public constant returns(bytes32) {
		return employeesRootHashes[_index];
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
	 * @param _index The index of the employee record
	 * @param _prevRootHash The previous root hash of the employee record 
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
	 *	Increases salary of a single employee.
	 * 
	 * @param _rowId The address of the payraise contract 
	 * @param _checks An array that contains information which hashes need to be computed
	 * @param _indexOfFirstLeaf The index of the first leaf node
	 * @param _hashes The hashes which do not need to be computed
	 * @param _values The values of the leaf nodes which change in this function
	 */
	function increaseSalarySingleEmployee(uint _rowId, bool[] _checks, uint8 _indexOfFirstLeaf, bytes32[] _hashes, bytes32[] _values) public {

		// Check integrity
		bytes32 computedHash = _createTree(_checks, _indexOfFirstLeaf, _hashes, _values);
		if (computedHash != employeesRootHashes[_rowId]) {
			IntegrityCheckFailedEvent();
			return;
		}

		uint percentage = payRaiseContract.getPercentage();
		uint8 salaryIndex = _indexOfFirstLeaf + SALARY_INDEX_OFFSET;
		uint256 salary = uint256(_values[salaryIndex]);
		uint newSalary = salary + salary * percentage / 100;
		_values[salaryIndex] = bytes32(newSalary);
		employeesRootHashes[_rowId] = _createTree(_checks, _indexOfFirstLeaf, _hashes, _values);
		ReturnNewValues(_rowId, computedHash, employeesRootHashes[_rowId], newSalary);

	}
	
	// Define private functions
	function _createTree(bool[] _checks, uint8 _indexOfFirstLeaf, bytes32[] _hashes, bytes32[] _values) private view returns (bytes32 hash) {
		return _computeHash(0, _checks, _indexOfFirstLeaf, _hashes, _values);
	}

	function _computeHash(uint8 _index, bool[] _checks, uint8 _indexOfFirstLeaf, bytes32[] _hashes, bytes32[] _values) private constant returns (bytes32 hash) {

		// Check if hash is given
		if (!_checks[_index]) {
			return _hashes[_index];
		}

		// Check if value is given
		if (_index >= _indexOfFirstLeaf) {
			return keccak256(_values[_index]);
		}

		// Compute hash from the children hashes
		return keccak256(
			_computeHash(_leftChild(_index), _checks, _indexOfFirstLeaf, _hashes, _values),
			_computeHash(_rightChild(_index), _checks, _indexOfFirstLeaf, _hashes, _values)
		);

	}

	function _leftChild(uint8 _index) private pure returns (uint8) {
		return _index * 2 + 1;
	}

	function _rightChild(uint8 _index) private pure returns (uint8) {
		return _index * 2 + 2;
	}	

}
