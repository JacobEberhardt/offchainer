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
CONTRACT_BUILD_FILE = '../../../blockchain/build/contracts/CounterMultiple.json'
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
	'counter',
	{
		root_hash: { type: Sequelize.STRING },
		counter_one: { type: Sequelize.INTEGER },
		counter_two: { type: Sequelize.INTEGER },
		counter_three: { type: Sequelize.INTEGER },
		counter_four: { type: Sequelize.INTEGER },
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
		const leaves = [counters.counterOne, counters.counterTwo, counters.counterThree, counters.counterFour].map(x => sha3({ value: x.toString(), type: 'uint8' }))
		const tree = new MerkleTree(leaves, sha3)
		const rootHash = tree.getRoot()
		// Insert new counters
		db.create({
			root_hash: rootHash,
			counter_one: counters.counterOne,
			counter_two: counters.counterTwo,
			counter_three: counters.counterThree,
			counter_four: counters.counterFour
		}).then(result => {
			//contract.rowId = result.dataValues.id
			promisify(contract.instance.add)({
				args: [
					result.dataValues.id,
					rootHash
				]
			}).then(result => {
				var receipt = web3.eth.getTransactionReceipt(result);
				console.log(receipt);
				resolve(result)
			})
		})
	})
}

/**
 * Return all counters in the database.
 *
 * @return {Promise} A promise
 */
function getAllFromDb() {
	return db.readAll();
}

/**
 * Return all root hashes of counters in smart contract.
 *
 * @return {Promise} A promise
 */
function getRootHashFromSc(_index) {
	return promisify(contract.instance.getRootHash)({
		args: [
			_index
		]
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
		// Set event listeners
		events.watch(contract.instance.RequestSingleDataEvent) // Smart contract needs data
			.then(eventResult => {
				console.log('Request Event');
				console.log(eventResult.args.rowId.c[0]);
				console.log(eventResult.args.colId.c[0]);
				db.read({ id: eventResult.args.rowId.c[0] }).then(dbResult => {
					console.log('DB query');
					console.log(dbResult)
					const leaves = [
						dbResult.counter_one,
						dbResult.counter_two,
						dbResult.counter_three,
						dbResult.counter_four
					]
					console.log(leaves)
					// transform int to uint8 bytes because that is what being done in SC.
					const tree = new MerkleTree(leaves.map(x => sha3({ value: x.toString(), type: 'uint8' })), sha3)
					const proof = tree.getProof(eventResult.args.colId.c[0])
					console.log('roooooooot');
					console.log(tree.getRoot());
					console.log(leaves[eventResult.args.colId.c[0]]);
					doSingleCounterIncrease({
						args: [
							eventResult.args.rowId.c[0],
							leaves[eventResult.args.colId.c[0]],
							proof.proofData,
							proof.proofPosition,
							{ gas: 300000 }
						]
					})
				})
			})

		events.watch(contract.instance.ReturnNewRootHash) // Return the new root hash
			.then(result => {
				console.log('Event---------')
				console.log(result)
				var newRootHash = result.args.proof
				var newCounterValue = result.args.newCounterValue.c[0]

				var colName;
				if (colId === 0) {
					colName = "counter_one"
				} else if (colId === 1) {
					colName = "counter_two"
				} else if (colId === 2) {
					colname = "counter_three"
				} else if (colId === 3) {
					colname = "counter_four"
				}


				var counterUpdate = {};
				counterUpdate[colName] = newCounterValue
				counterUpdate["root_hash"] = newRootHash

				db.update(
					{ id: rowId },
					counterUpdate
				)
					.then(resolve)

			})
			.catch(handler)

		events.watch(contract.instance.IntegrityCheckFailedEvent2) // Given data failed the integrity chec
			.then(result => {
				console.log(result)
				reject('Integrity check failed.')
			})
			.catch(handler)


			.then(result => db.update(
				{ id: contract.rowId },
				{
					counter_one: result.args.counters[0].c[0],
					counter_two: result.args.counters[1].c[0],
					counter_three: result.args.counters[2].c[0],
					counter_four: result.args.counters[3].c[0]
				}
			))
			.then(result => resolve(result[1][0])) // Resolve with the resulting row
			.catch(handler)

		// Request counter increase
		promisify(contract.instance.requestSingleCounterIncrease)({ args: [rowId, colId] })
			.catch(handler)
	})

}
// Export functions
module.exports = {
	create,
	add,
	getAllFromDb,
	getRootHashFromSc,
	setInstance,
	hasInstance,
	increaseSingle
}
