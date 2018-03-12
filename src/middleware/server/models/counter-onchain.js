// Import dependencies
const web3 = require('../config/web3')
const fs = require('fs')
const path = require('path')

// Import utilities
const promisify = require('../utils/promisify')
const events = require('../utils/events')
const web3Util = require('../utils/web3')

// Define values
CONTRACT_BUILD_FILE = '../../../blockchain/build/contracts/CounterOnchain.json'
INITIAL_GAS = 4700000

// Import contract data
const contractData = JSON.parse(fs.readFileSync(path.join(__dirname, CONTRACT_BUILD_FILE)))

// Create contract object
const contract = web3.eth.contract(contractData.abi)

// Set default account
web3Util.setDefaultAccount(web3, 0)

// Define functions
/**
 * Create a new contract instance.
 *
 * @return {Promise} A promise that depends on the contract creation
 */
function create() {

	var counterData = new Array(64).fill(0)

	return promisify(contract.new)({
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
			.then(result => resolve(web3.eth.getTransactionReceipt(result)))
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
