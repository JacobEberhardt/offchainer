// Required version
pragma solidity ^0.4.17;

import "./PayRaiseOnChain.sol";

contract EmployeeOnChain {

    struct Employee_Struct {
        string firstName;
        string lastName;
        uint256 startDate;
        bytes32 department;
        uint256 salary;
    }


	// Variables
	address creator;
	mapping(uint => Employee_Struct) employees;
    uint counter;
	PayRaiseOnChain payRaiseContract;

	// Events
	//event RetrieveDataEvent(bytes32 department, bytes32 fromEntryDate);
	//event IntegrityCheckFailedEvent(uint rowId, bytes32 proof1, bytes32 proof2);
	//event ReturnNewValues(uint rowId, bytes32 oldRoot, bytes32 newRoot, uint newSalary);

	// Constructor
	/**
	 * Create a new contract instance.
	 *
	 */
	function EmployeeOnChain() public {
	    creator = msg.sender;
        counter = 0;
	}

	// Public functions
	/**
	 * Adds the root hash of an employee record to employeesRootHashes mapping.
	 *
	 * param _index The index of the employee in the database
	 * param _rootHash The root hash of the merkle tree of the employee record
	 */
	function add(string firstName, string lastName, uint256 startDate,
        bytes32 department, uint256 salary) public {
    		employees[counter] = Employee_Struct(firstName, lastName, startDate, department, salary);
        counter++;
	}

	function get(uint _index) public constant returns(Employee_Struct) {
		return employees[_index];
	}
	/**
	 * Updates the root hash of an employee record
	 *
	 * @param _index The index of the employee record
	 * param _rootHash The new root hash of the employee record
	 */
	function update(uint _index, string firstName, string lastName, uint256 startDate,
        bytes32 department, uint256 salary) public {
		employees[_index] = Employee_Struct(firstName, lastName, startDate, department, salary);
	}

	/**
	 * Revert to previous hash. A Rollback function.
	 * param _index The index of the employee record
	 * param _prevRootHash The previous root hash of the employee record
	 */
//	 function rollBack(uint _index, bytes32 _prevRootHash) public {
//	    employeesRootHashes[_index] = _prevRootHash;
//	 }

	/**
	 * Initializes the operation to raise the salary of affected employees (depending on departmen and entry date)
	 * Function trigges Event and passes department and fromEntryDate
	 * @param _payRaiseContractAddress The address of the payraise contract
	 */
	function requestIncreaseSalary(address _payRaiseContractAddress) public {
		payRaiseContract = PayRaiseOnChain(_payRaiseContractAddress);
	    bytes32 department = payRaiseContract.getDepartment();
	    bytes32 beforeStartdate = payRaiseContract.getBeforeStartDate();
//TODO	    RetrieveDataEvent(department, beforeStartdate);

    // Iterate over every item in the list to find those belonging to the requested department and call the
    // increaseSalarySingleEmployee function for every employee that fits to the right department.
        for (uint i = 0; i < counter; i++) {
            if(employees[i].department == department){
                increaseSalarySingleEmployee(i);
            }
        }
	}

	/**
	 *  Increases salary of a single employee.
	 *
	 * @param _rowId The address of the payraise contract
	 * param _currentSalary The address of the payraise contract
	 * param _proof The address of the payraise contract
	 * param _proofPosition The address of the payraise contract
	 */
	function increaseSalarySingleEmployee(uint _rowId) public {
//	    bytes32 computedHash = _createTree(_currentSalary, _proof, _proofPosition);
		Employee_Struct existingEmployee = employees[_rowId];
		uint percentage = payRaiseContract.getPercentage();
		existingEmployee.salary = existingEmployee.salary + existingEmployee.salary * percentage / 100;
	}

}
