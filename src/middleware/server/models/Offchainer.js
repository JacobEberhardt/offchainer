// Import dependencies
const web3 = require('../config/web3')
const fs = require('fs')

// Define values
CONTRACT_BUILD_FILE = '../../../blockchain/build/Offchainer.json'
INITIAL_GAS = 4700000

// Import contract data
const contractData = JSON.parse(fs.readFileSync(CONTRACT_BUILD_FILE))

// Create contract object
const contract = web3.eth.contract(contractData.abi)

// Define functions
/**
 * Create a new contract instance.
 * @param {String} message The initial message
 * @returns {Promise} A promise that depends on the contract creation
 */
function create(message) {
	return contract.new(
		message,
		{
			from: web3.eth.accounts[0],
			data: contractData.bytecode,
			gas: INITIAL_GAS
		}
	)
}

// Export functions
module.exports = {
	create
}
