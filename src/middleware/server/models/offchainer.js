// Import dependencies
const web3 = require('../config/web3')
const fs = require('fs')
const path = require('path')

// Define values
CONTRACT_BUILD_FILE = '../../../blockchain/build/contracts/Offchainer.json'
INITIAL_GAS = 4700000

// Import contract data
const contractData = JSON.parse(fs.readFileSync(path.join(__dirname, CONTRACT_BUILD_FILE)))

// Create contract object
const contract = web3.eth.contract(contractData.abi)

// Define functions
/**
 * Create a new contract instance.
 * @returns {Promise} A promise that depends on the contract creation
 */
function create() {
	return new Promise((resolve, reject) => {
		try {
			contract.new(
				{
					from: web3.eth.accounts[0],
					data: contractData.bytecode,
					gas: INITIAL_GAS
				},
				function (err, contract) {
					if (err) reject(err)
					if (contract.address) resolve(contract) // Do not reject otherwise because the callback is called multiple times
				}
			)
		}
		catch (err) {
			reject(err)
		}
	})
}

/**
 * Set the address for the used contract instance to a given address.
 * @param {String} address The given address
 */
function setAddress(address) {
	contract.address = address
}

/**
 * Perform an integrity check on the given string.
 * @param {String} message The string check
 * @returns {Boolean} Whether the integrity was successful
 */
function checkMessage(message) {
	return contract.at(contract.address).checkMessage(message)
}

// Export functions
module.exports = {
	create,
	checkMessage
}
