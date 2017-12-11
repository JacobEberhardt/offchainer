// Import dependencies
const web3 = require('../config/web3')
const fs = require('fs')
const path = require('path')
const Database = require('./database')
const Sequelize = require('sequelize')

// Import utilities
const promisify = require('../utils/promisify')
const events = require('../utils/events')
const MerkleTree = require('../utils/merkleTree')
const sha3 = require('../utils/sha3')
const type = require('../utils/type')
const web3Util = require('../utils/web3')
const transactions = require('../utils/transactions')

// Define values
CONTRACT_BUILD_FILE = '../../../blockchain/build/contracts/CounterOnchain.json'
INITIAL_GAS = 4700000
COLUMN_NAMES = ['counter_one', 'counter_two', 'counter_three', 'counter_four']

// Import contract data
const contractData = JSON.parse(fs.readFileSync(path.join(__dirname, CONTRACT_BUILD_FILE)))

// Create contract object
const contract = web3.eth.contract(contractData.abi)

// Set default account
web3Util.setDefaultAccount(web3, 0)

// Establish database connection
const db = new Database(
	'counter',
	{
		root_hash: {type : Sequelize.STRING},
		counter_one: {type: Sequelize.INTEGER},
		counter_two: {type: Sequelize.INTEGER},
		counter_three: {type: Sequelize.INTEGER},
		counter_four: {type: Sequelize.INTEGER},
	}
)

// Define functions
/**
 * Create a new contract instance.
 *
 * @return {Promise} A promise that depends on the contract creation
 */
function create() {

	const newFunction = promisify(contract.new)

	return db.create({
		root_hash: '0xabcdef',
		counter_one: 0,
		counter_two: 0,
		counter_three: 0,
		counter_four: 0
	})
	.then(result => contract.rowId = result.dataValues.id) // Store the rowId for the used instance in a new property of the "global" contract object
	.then(result => {
		var counterData = [];
		for (var i = 0; i < 64; i++) {
		   counterData.push(0);
		}
		return promisify (contract.new)({
			args: [
				counterData,
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
 * Increase the counter with the given index.
 *
 * @param {Integer} index The index of the counter to increase
 * @returns {Promise} A promise that depends on the successful counter increase
 */
function increaseCounter(index) {

	return new Promise ((resolve, reject) => {

		// Define functions
		const handler = (err) => reject(err)
		const doCounterIncrease = promisify(contract.instance.doCounterIncrease)

		// Request counter increase
		promisify(contract.instance.doCounterIncrease)({args: [2, index]})
			.then(result => {
				var receipt = web3.eth.getTransactionReceipt(result);
				resolve(receipt)
			})
			.catch(handler)
	})
}

// Export functions
module.exports = {
	create,
	setInstance,
	hasInstance,
	increaseCounter
}
