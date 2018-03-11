// Required version
pragma solidity ^0.4.17;

contract PayraiseOnchain {

	// Variables
	address private creator;
	uint private percentage;
	bytes32 private department;
	uint256 private beforeStartDate;

	// Constructor
	/**
	 * Create a new contract instance.
	 * @param _percentage The percentage of the pay raise
	 * @param _department The affected department
	 * @param _beforeStartDate The start date as a condition whether an employee gets a pay raise (Employee start date < beforeStartDate)
	 */
	function PayraiseOnChain(uint _percentage, bytes32 _department, uint256 _beforeStartDate) public {
	    creator = msg.sender;
		percentage = _percentage;
		department = _department;
		beforeStartDate = _beforeStartDate;
	}

	// Public functions

	/**
	 * Gets the department which is affected by the pay raise
	 * @return The department
	 */
	function getDepartment() public constant returns (bytes32) {
		return department;
	}

	/**
	 * Gets the percentage of the pay raise
	 * @return The percentage
	 */
	function getPercentage() public constant returns (uint) {
		return percentage;
	}

	/**
	 * Gets the start date, which indicates whether the employee should be considered in the pay raise
	 * @return The start date
	 */
	function getBeforeStartDate() public constant returns (uint256) {
		return beforeStartDate;
	}

	/**
	 * Sets the department which is affected by the pay raise
	 * @param _newDepartment The department to be replaced
	 */
	function setDepartment(bytes32 _newDepartment) public {
		department = _newDepartment;
	}

	/**
	 * Set the percentage of the pay raise
	 * @param _newPercentage The percentage to be replaced
	 */
	function setPercentage(uint _newPercentage) public {
		percentage = _newPercentage;
	}

	/**
	 * Set the start date, which indicates whether the employee should be considered in the pay raise
	 * @param _newBeforeStartDate The start date to be replaced
	 */
	function setBeforeStartDate(uint256 _newBeforeStartDate) public {
		beforeStartDate = _newBeforeStartDate;
	}


	// Private functions

}
