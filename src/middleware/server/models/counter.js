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
	const leaves = [0, 0, 0, 0].map(x => sha3({value: x.toString(), type: 'uint8'}))
	const tree = new MerkleTree(leaves, sha3)

	// Initialize four counters to zero
	const rootHash = tree.getRoot()
	return new Promise((resolve, reject) => {
		db.create({
			root_hash: rootHash,
			counter_one: 0,
			counter_two: 0,
			counter_three: 0,
			counter_four: 0
		}).then(result => {
			contract.rowId = result.dataValues.id // Store the rowId for the used instance in a new property of the "global" contract object
			const promise = promisify(contract.new)({
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
			resolve(promise)
		}).catch(err => {
			reject({err: err, message: "Please Try Again Later"})
		})
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
		const revertRootHash = promisify(contract.instance.rollBack)
		var rootHashStateChangeTxHash

		// Set event listeners
		events.watch(contract.instance.RequestedCounterIncreaseEvent) // Smart contract needs data
			.then(result => {
				db.read({
					root_hash: result.args.integrityHash,
					id: contract.rowId
				}).then(result => {

					const leaves = [
						result.counter_one,
						result.counter_two,
						result.counter_three,
						result.counter_four
					]

					// transform int to uint8 bytes because that is what being done in SC.
					const tree = new MerkleTree(leaves.map(x => sha3({value: x.toString(), type: 'uint8'})), sha3)
					const proof = tree.getProof(index)
					console.log(result)
					doCounterIncrease({
						args: [
							leaves[index],
							proof.proofData,
							proof.proofPosition,
							{gas: 300000}
						]
					}).then(result => rootHashStateChangeTxHash = result) //store the transaction hash where a state is being changed
				})
			}).catch(handler)

		events.watch(contract.instance.returnNewRootHash) // Return the new root hash
			.then(result => {
				const prevRootHash = result.args.prevRootHash // saved for reverting when DB cannot update. 
				var newRootHash = result.args.newRootHash
				var newCounterValue = result.args.newCounterValue.c[0]

				// start watching for the tx to be mined.
				// might not be a good idea to do it from block 1, might get very long.

				var filter = web3.eth.filter({ fromBlock:1, toBlock: "latest" })
				filter.watch((error, blockHash) => {
					// console.log("the transaction I want " + rootHashStateChangeTxHash)
				    if (!error) {
				        var block = web3.eth.getBlock(blockHash.blockHash, true)     
				        if (block.transactions.length > 0) {
				        	// console.log(block.transactions)
				            for(var i = 0; i < block.transactions.length; i++) {
				            	// if that state change transaction is mined, we want to update the db now
				            	// we do not want to update the db first, because of consistency, what if someone 
				            	// uses the new roothash, but the state of SC has not been changed yet. 
				            
				            	if(block.transactions[i].hash === rootHashStateChangeTxHash) {
				            		var colName;
				            		console.log(typeof index)
				            		console.log(index === 0)
									if(index === 0) {
									    colName = "counter_one"
									} else if(index === 1) {
									    colName = "counter_two"
									} else if (index === 2) {
										colName = "counter_three"
									} else if (index === 3) {
										colName = "counter_four"
									}		

									var counterUpdate = {};
									counterUpdate[colName] = newCounterValue
									counterUpdate["root_hash"] = newRootHash

									//stop watching for the mining.
									filter.stopWatching()

									db.update(
										{id: contract.rowId},
										counterUpdate
									).then(() => resolve("Update Complete"))
									.catch(err => {
										// revert back the old transaction
										revertRootHash({
											args: [prevRootHash]
										}).then(() => reject("DB cannot update new state. State is reverted. ERR: " + err)) //reject or resolve? 
										.catch(handler)
									}) 
			
				            	}
				            }
				        } else {
				            console.log("no transaction in block: " + blockHash)
				        }
				    } else {
				    	reject(error)
				    }
				})

			}).catch(handler)

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

// Export functions
module.exports = {
	create,
	setInstance,
	hasInstance,
	increaseCounter
}
