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
CONTRACT_BUILD_FILE = '../../../blockchain/build/contracts/Employee.json'
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
	'employee',
	{
		first_name: { type: Sequelize.STRING },
		last_name: { type: Sequelize.STRING },
		start_date: { type: Sequelize.STRING },
		department: { type: Sequelize.STRING },
		salary: { type: Sequelize.INTEGER }
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
 * Create and insert an employee into the database and store the root hash of the data record into the smart contract
 * 
 * @param {Object} employee The new employee to add
 * @returns {Promise} A promise that depends on the successful employee insert
 */
function add(employee) {
	return new Promise((resolve, reject) => {
		
		const leaves = [
			employee.firstName,
			employee.lastName,
			employee.startDate,
			employee.department,
			employee.salary
		].map(x => sha3(x))
		console.log(leaves)
		const tree = new MerkleTree(leaves, sha3)
		const rootHash = tree.getRoot()
		
		db.create({
			first_name: employee.firstName,
			last_name: employee.lastName,
			start_date: employee.startDate,
			department: employee.department,
			salary: employee.salary
		})
			.then(result => {
				
				promisify(contract.instance.add)({
					args: [
						result.dataValues.id,
						rootHash
					]
				})
					.then(result => {
						resolve(result)
					})
					.catch(err => reject(err))
			})
			.catch(err => reject(err))
	})
}

/**
 * Return all employees in the database.
 *
 * @return {Promise} A promise that depends on the contract creation
 */
function getAll() {
	return db.readAll();
}

/**
 * Add a set of employees to the database and store the root hash of the data record into 
 * 
 * @param {Object[]} employees The set of employees to add
 * @returns {Promise} A promise that depends on the successful salary increase
 */
function importEmployees(employees) {
	return Promise.all(employees.map(add));
}

/**
 * Increase the salary of each affected employee.
 *
 * @returns {Promise} A promise that depends on the successful salary increase
 */
function increaseSalary(payRaiseContractAddress) {
	return new Promise ((resolve, reject) => {
		// Define functions
		const handler = (err) => reject(err)
		const increaseSalary = promisify(contract.instance.increaseSalarySingleEmployee)
		const revertRootHash = promisify(contract.instance.rollBack)

		// Define variables
		var newRootTransactionHash,
			oldRootHash,
			newRootHash,
			newCounterValue

		// Set event listeners

		// Smart contract needs data
		events.watch(contract.instance.RetrieveDataEvent)
			.then(result => db.readAll({
				department: result.args.department
				// start_date: contract.rowId
			}))
			.then(result => {
				console.log(result);
				// const leaves = [
				// 	result.counter_one,
				// 	result.counter_two,
				// 	result.counter_three,
				// 	result.counter_four
				// ]

				// const tree = new MerkleTree(leaves.map(sha3), sha3)
				// const proof = tree.getProof(index)

				// return doCounterIncrease({
				// 	args: [
				// 		leaves[index],
				// 		proof.proofData,
				// 		proof.proofPosition,
				// 		{gas: 300000}
				// 	]
				// })

			})
			// .then(result => newRootTransactionHash = result) // Store the transaction hash where a state is being changed
			// .catch(handler)

		// Smart contract returns new root hash
		events.watch(contract.instance.ReturnNewValues)
			.then(result => {
				
				// oldRootHash = result.args.prevRootHash
				// newRootHash = result.args.newRootHash
				// newCounterValue = result.args.newCounterValue.c[0]

				// return transactions.waitForBlock(web3, newRootTransactionHash)

			})
			// .then(() => {

			// 	const colName = COLUMN_NAMES[index]

			// 	return db.update(
			// 		{id: contract.rowId},
			// 		{
			// 			[colName]: newCounterValue,
			// 			root_hash: newRootHash
			// 		}
			// 	)
			// 		.catch(error => {
			// 			revertRootHash({args: oldRootHash})
			// 			reject(error)
			// 		})

			// })
			// .then(result => resolve(result))
			// .catch(handler)
		// Given data failed the integrity check
		events.watch(contract.instance.IntegrityCheckFailedEvent)
			.then(() => reject('Integrity check failed.'))
			.catch(handler)

		// Request counter increase
		promisify(contract.instance.requestIncreaseSalary)({
					args: [
						payRaiseContractAddress
					]
				})
			.catch(handler)

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

// Export functions
module.exports = {
	create,
	add,
	getAll,
	importEmployees,
	increaseSalary,
	setInstance,
	hasInstance
}
