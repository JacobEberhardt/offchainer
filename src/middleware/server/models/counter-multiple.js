// Import dependencies
const web3 = require('../config/web3')
const fs = require('fs')
const path = require('path')
const promisify = require('../utils/promisify')
const events = require('../utils/events')
const Database = require('./database')
const Sequelize = require('sequelize')
const MerkleTree = require('../utils/merkle-tree')
const sha3 = require('web3-utils').soliditySha3
const web3Util = require('../utils/web3')

// Define values
CONTRACT_BUILD_FILE = '../../../blockchain/build/contracts/CounterMultiple.json'
INITIAL_GAS = 4700000

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
		root_hash: {type: Sequelize.STRING},
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
 * Create and insert a counter into the database and store the root hash of the data record into the smart contract
 * 
 * @param {Object} counters The new counters to add
 * @returns {Promise} A promise that depends on the successful counters insert
 */
function add(counters) {

	// Create Merkle tree
	return new Promise((resolve, reject) => {

		const leaves = [counters.counterOne, counters.counterTwo, counters.counterThree, counters.counterFour].map(x => sha3({value: x.toString(), type: 'uint8'}))
		const tree = new MerkleTree(leaves, sha3)
		const rootHash = tree.getRoot()

		// Insert new counters
		db.create({
			root_hash: rootHash,
			counter_one: counters.counterOne,
			counter_two: counters.counterTwo,
			counter_three: counters.counterThree,
			counter_four: counters.counterFour
		})
			.then(result => {
				return promisify(contract.instance.add)({
					args: [
						result.dataValues.id,
						rootHash
					]
				})
			})
			.then(result => {
				var receipt = web3.eth.getTransactionReceipt(result);
				resolve(result)
			})

	})

}

/**
 * Return all counters in the database.
 *
 * @return {Promise} A promise
 */
function getAllFromDatabase() {
	return db.readAll();
}

/**
 * Return the root hashes of counters of a given index in smart contract.
 *
 * @param {Number} _index The index of the counters
 * @return {Promise} A promise
 */
function getRootHashFromSmartContract(_index) {
	return promisify(contract.instance.getRootHash)({args: _index})
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
 * Increase the counter with the given row and column index.
 *
 * @param {Integer} rowId The index of the counter row
 * @param {Integer} colId The index of the counter column to increase
 * @returns {Promise} A promise that depends on the successful counter increase
 */
function increaseSingle(rowId, colId) {

	return new Promise((resolve, reject) => {

		// Define functions
		const catchedEvent = false
		const handler = (err) => reject(err)
		const doSingleCounterIncrease = promisify(contract.instance.doSingleCounterIncrease)

		// Event Listeners
		// RequestSingleDataEvent
		events.watch(contract.instance.RequestSingleDataEvent) // Smart contract needs data
			.then(eventResult => {
				// Find data record with given index
				return db.read({id: eventResult.args.rowId.c[0]})
			})
			.then(dbResult => {
				// Create leaves of counter values 
				const leaves = [
					dbResult.counter_one,
					dbResult.counter_two,
					dbResult.counter_three,
					dbResult.counter_four
				]
				// Construct merkle tree
				const tree = new MerkleTree(leaves.map(x => sha3({value: x.toString(), type: 'uint8'})), sha3)
				// Get proof for give counter
				const proof = tree.getProof(eventResult.args.colId.c[0])
				// Call counter increase function
				doSingleCounterIncrease({
					args: [
						eventResult.args.rowId.c[0],
						leaves[eventResult.args.colId.c[0]],
						proof.proofData,
						proof.proofPosition,
						{gas: 300000}
					]
				})
			})

		// ReturnNewRootHash
		events.watch(contract.instance.ReturnNewRootHash) // Return the new root hash
			.then(result => {
				var newRootHash = result.args.proof
				var newCounterValue = result.args.newCounterValue.c[0]

				const words = ['one', 'two', 'three', 'four']
				var colName = 'counter_' + words[colId]

				var counterUpdate = {};
				counterUpdate[colName] = newCounterValue
				counterUpdate['root_hash'] = newRootHash

				// Update counters record
				return db.update(
					{id: rowId},
					counterUpdate
				)
					
			})
			.then(resolve)
			.catch(handler)

		// IntegrityCheckFailedEvent
		events.watch(contract.instance.IntegrityCheckFailedEvent)
			.then(result => {
				reject('Integrity check failed.')
			})
			.catch(handler)

		// Request counter increase
		promisify(contract.instance.requestSingleCounterIncrease)({args: [rowId, colId]})
			.catch(handler)
	})

}
// Export functions
module.exports = {
	create,
	add,
	getAllFromDatabase,
	getRootHashFromSmartContract,
	setInstance,
	hasInstance,
	increaseSingle
}
