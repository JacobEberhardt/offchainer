// Import dependencies
const web3 = require('../config/web3')
const fs = require('fs')
const path = require('path')
const promisify = require('../utils/promisify')
const events = require('../utils/events')
const Database = require('./database')
const Sequelize = require('sequelize')
const MerkleTree = require('../utils/merkleTree')
const sha3 = require('web3-utils').soliditySha3

// Define values
CONTRACT_BUILD_FILE = '../../../blockchain/build/contracts/Financials.json'
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
	'financials',
	{
		company_name: { type: Sequelize.STRING },
		recording_date: { type: Sequelize.STRING },
		total_sales: { type: Sequelize.INTEGER },
		cogs: { type: Sequelize.INTEGER },
		inventory_stock: { type: Sequelize.INTEGER },
		cash_counter: { type: Sequelize.INTEGER },
		accounts_receivables: { type: Sequelize.INTEGER },
		accounts_payable: { type: Sequelize.INTEGER },
	}
)

// Define functions


/**
 * Create a new contract instance.
 *
 * @return {Promise} A promise that depends on the contract creation
 */
/*function create() {
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
*/

function create(contractDetails) {
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
		// Insert new Employee
		db.create({
			company_name: financials.companyName,
			recording_date: financials.recordingDate,
			total_sales: financials.totalSales,
			cogs: financials.cogs,
			inventory_stock: financials.inventoryStock,
			cash_counter: financials.cashCounter,
			accounts_receivables: financials.accountsReceivables,
			accounts_payable: financials.accountsPayable
		}).then(result => {
			//Create Merkle Tree
			const leaves = [
				financials.companyName,
				financials.recordingDate,
				financials.totalSales,
				financials.cogs,
				financials.inventoryStock,
				financials.cashCounter,
				financials.accountsReceivables,
				financials.accountsPayable
			].map(x => sha3(x))
			const tree = new MerkleTree(leaves, sha3)
			const rootHash = tree.getRoot()
			promisify(contract.instance.addRecordEntry)({
				args: [
					result.dataValues.id,
					rootHash
				]
			}).then(result => resolve(result));
		})
	})

}

/**
 * Return all financial records in the database.
 *
 * @return {Promise} A promise that depends on the contract creation
 */
function getAllFinancials() {
	return db.readAll();
}

/**
 * Add a more than a one set of records to the database and store the root hash of the data record into 

 */
/*function importFinancials(financials) {
	return db.createMany(financials)
}*/



function addRecordEntry() {
	return new promisify(contract.at(contract.currentAddress).addRecordEntry)

}


function getAllRecordEntries() {
	return promisify(contract.instance.getAllRecordEntries)
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
	getAllFinancials,
	setInstance,
	addRecordEntry,
	getAllRecordEntries,
	hasInstance
}
