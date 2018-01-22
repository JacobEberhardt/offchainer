// Import dependencies
const web3 = require('../config/web3')
const fs = require('fs')
const path = require('path')
const promisify = require('../utils/promisify')
const web3Util = require('../utils/web3')

// Define values
CONTRACT_BUILD_FILE = '../../../blockchain/build/contracts/FinancialsOnchain.json'
INITIAL_GAS = 4700000

// Import contract data
const contractData = JSON.parse(fs.readFileSync(path.join(__dirname, CONTRACT_BUILD_FILE)))

// Create contract object
const contract = web3.eth.contract(contractData.abi)

// Set default account
web3Util.setDefaultAccount(web3,0)

//Contract construction
/**
 * Create a new contract instance.
 *
 * @return {Promise} A promise that depends on the contract creation
 */
function create() {
	console.log(web3.eth.accounts)
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
 * Create and insert an financial records into the database and store the root hash of the data record into the smart contract
 * 
 * @param {Object} financials The new financial record to add
 * @returns {Promise} A promise that depends on the successful  insert of financials object
 */
function add(financials) {
	return new Promise((resolve, reject) => {
		// Insert new company entry
		
			promisify(contract.instance.addRecordEntry)({
				args: [
					financials.companyName,
                    financials.recordingDate,
                    financials.totalSales,
                    financials.cogs,
                    financials.inventoryStock,
                    financials.cashCounter,
                    financials.accountsReceivables,
                    financials.accountsPayable,
                    {gas:6000000}
				]
			}).then(result => resolve(result));
	})

}


/**
 * Return Root has for a specific entry specified by index
 *
 * @return {Promise} A promise that contains the return value: RecordingData
 */
function getRecordingDate(indexOfRecord){
	return new promisify(contract.instance.getRecordingDate)({args: indexOfRecord})
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
	setInstance,
	getRecordingDate,
	hasInstance
}