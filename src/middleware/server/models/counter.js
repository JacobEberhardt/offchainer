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
CONTRACT_BUILD_FILE = '../../../blockchain/build/contracts/Counter.json'
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
	// https://ethereum.stackexchange.com/questions/2632/how-does-soliditys-sha3-keccak256-hash-uints
	// transform int to uint8 bytes because that is what being done in SC.
	const leaves = [0, 0, 0, 0].map(sha3)
	const tree = new MerkleTree(leaves, sha3)

	// Initialize four counters to zero
	const rootHash = tree.getRoot()
	const newFunction = promisify(contract.new)

	return db.create({
		root_hash: rootHash,
		counter_one: 0,
		counter_two: 0,
		counter_three: 0,
		counter_four: 0
	})
	.then(result => contract.rowId = result.dataValues.id) // Store the rowId for the used instance in a new property of the "global" contract object
	.then(result => newFunction({
		args: [
			rootHash,
			{
				from: web3.eth.accounts[0],
				data: contractData.bytecode,
				gas: INITIAL_GAS
			}
		],
		requiredProperty: 'address',
		context: contract
	}))

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
		const revertRootHash = promisify(contract.instance.rollBack)

		// Define variables
		var newRootTransactionHash,
			oldRootHash,
			newRootHash,
			newCounterValue

		// Set event listeners

		// Smart contract needs data
		events.watch(contract.instance.RequestedCounterIncreaseEvent)
			.then(result => db.read({
				root_hash: result.args.integrityHash,
				id: contract.rowId
			}))
			.then(result => {

				const leaves = [
					result.counter_one,
					result.counter_two,
					result.counter_three,
					result.counter_four
				]

				const tree = new MerkleTree(leaves.map(sha3), sha3)
				const proof = tree.getProof(index)

				return doCounterIncrease({
					args: [
						leaves[index],
						proof.proofData,
						proof.proofPosition,
						{gas: 300000}
					]
				})

			})
			.then(result => newRootTransactionHash = result) // Store the transaction hash where a state is being changed
			.catch(handler)

		// Smart contract returns new root hash
		events.watch(contract.instance.returnNewRootHash)
			.then(result => {
				
				oldRootHash = result.args.prevRootHash
				newRootHash = result.args.newRootHash
				newCounterValue = result.args.newCounterValue.c[0]

				return transactions.waitForBlock(web3, newRootTransactionHash)

			}) 
			.then(() => {
				const colName = COLUMN_NAMES[index]

				return db.update(
					{id: contract.rowId},
					{
						[colName]: newCounterValue,
						root_hash: newRootHash
					}
				)

			})
			.then(result => resolve(result))
			.catch(error => {
				if(error.name) { // if it is an Error based, which is thrown by DB. Going forward we should use custom Error types
					revertRootHash({args: oldRootHash})
					.then(result => {
						reject("Reverting previous roothash. Transaction: " + result)
					})
				} else {
					reject(error)
				}
				
			})
			
			
			
		// Given data failed the integrity check
		events.watch(contract.instance.IntegrityCheckFailedEvent)
			.then(() => reject('Integrity check failed.'))
			.catch(handler)

		// Request counter increase
		promisify(contract.instance.requestCounterIncrease)({args: index})
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
