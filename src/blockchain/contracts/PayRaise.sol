// Required version
pragma solidity ^0.4.17;

contract PayRaise {
	
	// Declare variables
	address creator;
	mapping(uint => bytes32) employeeRootHashes;
	uint percentage;
	string department;
	string fromEntryDate;

	// Declare events
	event RetrieveDataEvent(string affectedDepartment, string entryDate);
	event TransactionCompletedEvent();

	// Define public functions 
	/**
	 * Create a new contract instance.
	 * @param _percentage The percentage of the pay raise
	 */
	function PayRaise(uint _percentage, string _department, string _fromEntryDate) public {
	    creator = msg.sender;
		percentage = _percentage;
		department = _department;
		fromEntryDate = _fromEntryDate;
	}

	/**
	 * Adds the root hash of an employee record to employeeRootHashes mapping.
	 * @param _index The index of the employee in the database
	 * @param _rootHash The root hash of the merkle tree of the employee record
	 */
	function addEmployee(uint8 _index, bytes32 _rootHash) public {
		employeeRootHashes[_index] = _rootHash;
	}

	/**
	 * Updates the root hash of an employee record
	 * @param _index The index of the employee record
	 * @param _rootHash The new root hash of the employee record 
	 */
	function updateEmployee(uint8 _index, bytes32 _rootHash) public {
		employeeRootHashes[_index] = _rootHash;
	}

	/**
	 * Update the department which is affected by the pay raise
	 * @param _newDepartment The department to be replaced 
	 */
	function updateDepartment(string _newDepartment) public {
		department = _newDepartment;
	}
	
	/**
	 * Update the percentage of the pay raise
	 * @param _newPercentage The percentage to be replaced 
	 */
	function updatePercentage(uint8 _newPercentage) public {
		percentage = _newPercentage;
	}

	/**
	 * Initializes the operation to raise the salary of affected employees (depending on departmen and entry date)
	 * Function trigges Event and passes department and fromEntryDate
	 *  
	 */
	function raiseSalary() public {
	    RetrieveDataEvent(department, fromEntryDate);
	}
	
	/**
	 * Raises the salary for one employee. Therfore check integrity of employee data record, increase salary by given percentage
	 * and compute the new hash of the new salary as well as the new root hash to store into employee mapping 
	 * @param _singleEmployeeProofs Data entry (salary) and proofs for this data entry
	 */
	function makePayRaiseForOne(bytes32[] _singleEmployeeProofs) public returns (bytes32[] _singleEmployeeNewProofs) {
	    
	}
	
	/**
	 * Raises the salary for many employees (100). Therfore check integrity of each employee data record, increase salary by given percentage
	 * and compute the new hash of the new salary as well as the new root hash to store into employee mapping 
	 * @param _manyEmployeesProofs The percentage to be replaced 
	 */
	function makePayRaiseForMany(bytes32[100][] _manyEmployeesProofs) public returns (bytes32[100][] _manyEmployeesNewProofs) {
	    
	}

}
