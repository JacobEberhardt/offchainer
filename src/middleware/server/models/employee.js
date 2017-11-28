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
CONTRACT_BUILD_FILE = '../../../blockchain/build/contracts/PayRaise.json'
INITIAL_GAS = 4700000

// Import contract data
const contractData = JSON.parse(fs.readFileSync(path.join(__dirname, CONTRACT_BUILD_FILE)))

// Create contract object
const contract = web3.eth.contract(contractData.abi)

// Set default account
var interval = setInterval(function() { // Poll to wait for web3 connection
	if (web3.isConnected()) {
		web3.eth.defaultAccount = web3.eth.accounts[0] // Set default account
		clearInterval(interval)
	}
}, 500)

// Establish database connection
const db = new Database(
	'employee',
	{
		first_name: {type : Sequelize.STRING},
		last_name: {type: Sequelize.STRING},
		entry_date: {type: Sequelize.STRING},
		salary: {type: Sequelize.INTEGER}
	}
)

// Define functions
/**
 * Create a new contract instance.
 *
 * @return {Promise} A promise that depends on the contract creation
 */
function createPayRaiseContract(percentage, department, fromEntryDate) {
	return promisify(contract.new)({
		args: [
			percentage,
			department,
			fromEntryDate,
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

/**
 * Increase the salary of each affected employee.
 *
 * @returns {Promise} A promise that depends on the successful salary increase
 */
function increaseSalary() {

}

// Export functions
module.exports = {
	create,
	setInstance,
	hasInstance,
	increaseSalary
}
