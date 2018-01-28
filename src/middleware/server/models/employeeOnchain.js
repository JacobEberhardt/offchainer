// Import dependencies
const web3 = require('../config/web3')
const fs = require('fs')
const path = require('path')
const promisify = require('../utils/promisify')
const web3Util = require('../utils/web3')

// Define values
CONTRACT_BUILD_FILE = '../../../blockchain/build/contracts/EmployeeOnChain.json'
INITIAL_GAS = 4700000
COLUMN_NAMES = ['first_name', 'last_name', 'start_date', 'department', 'salary']

// Import contract data
const contractData = JSON.parse(fs.readFileSync(path.join(__dirname, CONTRACT_BUILD_FILE)))

// Create contract object
const contract = web3.eth.contract(contractData.abi, {gas: 6000000})

// Set default account
web3Util.setDefaultAccount(web3, 0)

/**
 * Create a new contract instance.
 *
 * @return {Promise} A promise that depends on the contract creation
 */
function create() {
	return promisify(contract.new)({
		args: [
			{
				from: web3.eth.accounts[0],
				data: contractData.bytecode,
				gas: INITIAL_GAS
			}
		],
		requiredProperty: 'address',
		context: contract
	})
		.then(result => {
			var receipt = web3.eth.getTransactionReceipt(result.transactionHash);
			return {contract: result, receipt: receipt} //resolve(receipt)
		})
}


/**
 * Create and insert an employee into the database and store the root hash of the data record into the smart contract
 *
 * @param {Object} employee The new employee to add
 * @returns {Promise} A promise that depends on the successful employee insert
 */
function add(employee) {

	return new Promise((resolve, reject) => {

    return promisify(contract.instance.add)({
			args: [
        employee.firstName,
  			employee.lastName,
  			employee.startDate,
  			employee.department,
  			employee.salary,
        {gas: 6000000}
			]
		}) //, result]))
		.then((result) => {
			var receipt = web3.eth.getTransactionReceipt(result);
			resolve({result:result, transaction:receipt})
		})
		.catch(err => reject(err))

	})

}

/**
 * Return the root hash of an employee stored in the smart contract.
 *
 * @return {Promise} A promise that depends on the contract creation
 */
function getEmployeeSalary(index) {
	return promisify(contract.instance.getSalary)({args: index})
}

/**
 * Add a set of employees to the database and store the root hash of the data record into
 *
 * @param {Object[]} employees The set of employees to add
 * @returns {Promise} A promise that depends on the successful salary increase
 */
function importEmployees(employees) {
	return Promise.all(employees.map(add))
}

/**
 * Increase the salary of all affected employee. Affected employees are defined in a payraise contract.
 *
 * @param {String} payRaiseContractAddress The address of the payraise contract
 * @returns {Promise} A promise that depends on the successful salary increase
 */
function increaseSalary(payRaiseContractAddress) {

  return new Promise ((resolve, reject) => {
    const handler = (err) => reject(err)

    // Increase salary request for all employees in the specified department of the payraise contract
    promisify(contract.instance.requestIncreaseSalary)({args: payRaiseContractAddress})
      .then((result) => {
        resolve(result)
      })
      .catch(handler)
	})
}

/**
 * Set the address for the used contract instance to a given address.
 *
 * @param {String} address The given address
 * @return {String} The instance store in the contract
 */
function setInstance(address) {
	return contract.instance = contract.at(address)
}

/**
 * Check if there is an instance address stored for the contract.
 *
 * @returns {Boolean} Whether there is an address stored
 */
function hasInstance() {
	return contract.instance != undefined
}

// Export functions
module.exports = {
	create,
	add,
	getEmployeeSalary,
	importEmployees,
	increaseSalary,
	setInstance,
	hasInstance
}
