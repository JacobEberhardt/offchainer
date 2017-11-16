// Import dependencies
const web3 = require('../config/web3')
const fs = require('fs')
const path = require('path')
const promisify = require('../utils/promisify')

// Define values
CONTRACT_BUILD_FILE = '../../../blockchain/build/contracts/Offchainer.json'
INITIAL_GAS = 4700000

// Import contract data
const contractData = JSON.parse(fs.readFileSync(path.join(__dirname, CONTRACT_BUILD_FILE)))

// Create contract object
const contract = web3.eth.contract(contractData.abi)
web3.eth.defaultAccount = web3.eth.accounts[0] // Set default account

// Define functions
/**
 * Create a new contract instance.
 *
 * @return {Promise} A promise that depends on the contract creation
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
					if (contract.address) resolve(contract) // Do not reject here because the callback is called multiple times
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
	return contract.currentAddress !== undefined
}

/**
 * Set the message to a given string.
 *
 * @param {String} message The given string
 */
function setMessage(message) {
	return promisify(contract.at(contract.currentAddress).setMessage, {arg: message})
}

/**
 * Perform an integrity check on the given string.
 *
 * @param {String} message The string check
 * @return {Boolean} Whether the integrity was successful
 */
function checkMessage(message) {
	return new promisify(contract.at(contract.currentAddress).checkMessage, {arg: message})
}

// Export functions
module.exports = {
	create,
	setAddress,
	hasAddress,
	setMessage,
	checkMessage
}
