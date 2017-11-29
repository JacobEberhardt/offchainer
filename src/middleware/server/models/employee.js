// Import dependencies
const web3 = require('../config/web3')
const fs = require('fs')
const path = require('path')
const promisify = require('../utils/promisify')
const events = require('../utils/events')
const Database = require('./database')
const Sequelize = require('sequelize')
const MerkleTree = require('../utils/merkleTree')

// Define values
CONTRACT_BUILD_FILE = '../../../blockchain/build/contracts/Employee.json'
INITIAL_GAS = 4700000

// Import contract data
const contractData = JSON.parse(fs.readFileSync(path.join(__dirname, CONTRACT_BUILD_FILE)))

// Create contract object
const contract = web3.eth.contract(contractData.abi)

// Set default account
var interval = setInterval(function () { // Poll to wait for web3 connection
	if (web3.isConnected()) {
		web3.eth.defaultAccount = web3.eth.accounts[0] // Set default account
		clearInterval(interval)
	}
}, 500)

// Establish database connection
const db = new Database(
	'employee',
	{
		first_name: { type: Sequelize.STRING },
		last_name: { type: Sequelize.STRING },
		start_date: { type: Sequelize.STRING },
		department: { type: Sequelize.STRING },
		salary: { type: Sequelize.INTEGER }
	}
)

// Define functions


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
}


/**
 * Create and insert an employee into the database and store the root hash of the data record into the smart contract
 * 
 * @param {Object} employee The new employee to add
 * @returns {Promise} A promise that depends on the successful employee insert
 */
function add(employee) {
	// Insert new Employee
	return db.create({
		first_name: employee.firstName,
		last_name: employee.lastName,
		start_date: employee.startDate,
		department: employee.department,
		salary: employee.salary
	})
	// .then(result => {
	// 	// Create merkle tree first
	// 	// TODO

	// 	// Send index and merkle root to SC
	// 	// TODO

	// 	// For now just return result
	// 	return result
	// })
}

/**
 * Return all employees in the database.
 *
 * @return {Promise} A promise that depends on the contract creation
 */
function getAll() {
	return db.readAll();
}

/**
 * Add a set of employees to the database and store the root hash of the data record into 
 * 
 * @param {Object[]} employees The set of employees to add
 * @returns {Promise} A promise that depends on the successful salary increase
 */
function importEmployees(employees) {
	return db.createMany(employees)
}

/**
 * Increase the salary of each affected employee.
 *
 * @returns {Promise} A promise that depends on the successful salary increase
 */
function increaseSalary(payRaiseContractAddress) {

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
	getAll,
	importEmployees,
	increaseSalary,
	setInstance,
	hasInstance
}
