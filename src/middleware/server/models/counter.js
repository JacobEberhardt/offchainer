// Import dependencies
const web3 = require('../config/web3')
const fs = require('fs')
const path = require('path')
const promisify = require('../utils/promisify')

// Define values
CONTRACT_BUILD_FILE = '../../../blockchain/build/contracts/Counter.json'
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

// Define functions
/**
 * Create a new contract instance.
 *
 * @return {Promise} A promise that depends on the contract creation
 */
function create() {
	return promisify(contract.new)({
		args: {
			from: web3.eth.accounts[0],
			data: contractData.bytecode,
			gas: INITIAL_GAS
		},
		requiredProperty: 'address',
		context: contract
	})
}

/**
 * Set the address for the used contract instance to a given address.
 *
 * @param {String} address The given address
 * @return {String} The new address
 */
function setAddress(address) {
	return contract.currentAddress = address
}

/**
 * Check if there is an address stored for the contract.
 *
 * @returns {Boolean} Whether there is an address stored
 */
function hasAddress() {
	return contract.currentAddress != undefined
}

// Export functions
module.exports = {
	create,
	setAddress,
	hasAddress
}
