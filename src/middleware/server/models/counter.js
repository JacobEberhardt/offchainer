// Import dependencies
const web3 = require('../config/web3')
const fs = require('fs')
const path = require('path')
const promisify = require('../utils/promisify')
const events = require('../utils/events')
const Database = require('./database')
const Sequelize = require('sequelize')
const MerkleTree = require('../utils/merkleTree')
const leftPad = require('left-pad')

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
	const tree = new MerkleTree([0, 0, 0, 0].map(data => sha3(leftPad((data).toString(16), 2, 0))), sha3)

	const rootHash = tree.getRoot()
	// Initialize four counters to zero
	db.create({
		root_hash: rootHash,
		counter_one: 0,
		counter_two: 0,
		counter_three: 0,
		counter_four: 0
	})
		.then(result => contract.rowId = result.dataValues.id) // Store the rowId for the used instance in a new property of the "global" contract object
	return promisify(contract.new)({
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

		// Set event listeners
		events.watch(contract.instance.RequestedCounterIncreaseEvent) // Smart contract needs data
			.then(result => {
				db.read({root_hash: result.args.integrityHash}).then(result => {

					const leaves = [
						result.counter_one,
						result.counter_two,
						result.counter_three,
						result.counter_four
					]	

					// transform int to uint8 bytes because that is what being done in SC.
					const tree = new MerkleTree(leaves.map(data => sha3(leftPad((data).toString(16), 2, 0))), sha3)
					const proof = tree.getProof(index, index)
					var proofData = []
					var proofPosition = [];

					// Create proofData obj and the proof posistions
					for(var i = 0; i < proof.length; i++) {
						proofPosition.push(proof[i].position === "left" ? 0 : 1)
						proofData.push(proof[i].data)
					}	

					doCounterIncrease({
						args: [
							leaves[index],
							proofData,
							proofPosition,
							{gas: 300000}
						]
					})

				})	
			}).catch(handler)

		events.watch(contract.instance.returnNewRootHash) // Return the new root hash
			.then( result => {
				console.log(result.args) // the new roothash and the new counter value. 
			})
			.catch(handler)

		events.watch(contract.instance.IntegrityCheckFailedEvent) // Given data failed the integrity check
			.then(() => reject('Integrity check failed.'))
			.catch(handler)

		events.watch(contract.instance.CounterIncreasedEvent) // Counter was successfully increased
			.then(result => db.update(
				{id: contract.rowId},
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
		promisify(contract.instance.requestCounterIncrease)({args: index})
			.catch(handler)

	})

}

// The hash algoirhtm we use to construct the Merkle Tree
function sha3(data) {
  // returns a hex representation of bytes32
  return web3.sha3(data, {encoding: "hex"});
}


// Export functions
module.exports = {
	create,
	setInstance,
	hasInstance,
	increaseCounter
}
