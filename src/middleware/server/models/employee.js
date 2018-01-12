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
const transactions = require('../utils/transactions')
const web3Util = require('../utils/web3')

// Define values
CONTRACT_BUILD_FILE = '../../../blockchain/build/contracts/Employee.json'
INITIAL_GAS = 4700000
COLUMN_NAMES = ['first_name', 'last_name', 'start_date', 'department', 'salary']

// Import contract data
const contractData = JSON.parse(fs.readFileSync(path.join(__dirname, CONTRACT_BUILD_FILE)))

// Create contract object
const contract = web3.eth.contract(contractData.abi)

// Set default account
web3Util.setDefaultAccount(web3, 0)

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
 * Create and insert an employee into the database and store the root hash of the data record into the smart contract.
 * 
 * @param {Object} employee The new employee to add
 * @returns {Promise} A promise that depends on the successful employee insert
 */
function addEmployeeToDatabase(employee) {

	return new Promise((resolve, reject) => {
		
		const leaves = [
			employee.firstName,
			employee.lastName,
			employee.startDate,
			employee.department,
			employee.salary
		]

		const tree = new MerkleTree(leaves.map(x => sha3({value: x, type: 'string'})), sha3, {hashLeaves: false})
		const rootHash = tree.getRoot()

		db.create({
			first_name: employee.firstName,
			last_name: employee.lastName,
			start_date: employee.startDate,
			department: employee.department,
			salary: employee.salary
		})
			.then(result => {
				return Promise.all([promisify(contract.instance.add)({
					args: [
						result.dataValues.id,
						rootHash
					]
				}), result])
			})
			.then(([result, previous]) => resolve(previous))
			.catch(err => reject(err))

	})

}

/**
 * Return all employees in the database.
 *
 * @return {Promise} A promise that depends on the contract creation
 */
function getAll() {
	return db.readAll()
}

/**
 * Return the root hash of an employee stored in the smart contract.
 *
 * @return {Promise} A promise that depends on the contract creation
 */
function getRootHash(index) {
	return promisify(contract.instance.get)({args: index})
}

/**
 * Add a set of employees to the database and store the root hash of the data record into 
 * 
 * @param {Object[]} employees The set of employees to add
 * @returns {Promise} A promise that depends on the successful salary increase
 */
function importEmployees(employees) {
	return Promise.all(employees.map(addEmployeeToDatabase))
}

/**
 * Increase the salary of a single employee.
 *
 * @param {Object} employee The employee
 * @returns {Promise} A promise that depends on the successful salary increase
 */
function increaseSalarySingleEmployee(employee) {

	return new Promise ((resolve, reject) => {

		// Error Handler
		const handler = (error) => reject({
			'id': employee.id,
			'error': error
		})

		// Smart contract returns new values
		events.watch(contract.instance.ReturnNewValues)
			.then(result => {
				// Wait for transaction to be mined, pass return values to next chain
				return Promise.all([transactions.waitForBlock(web3, transactionHash), result])
			})
			.then(([result, previous])  => {
				// Write new salary from previous chain results to database 
				return Promise.all([db.update(
					{id: previous.args.rowId.c[0]},
					{
						['salary']: previous.args.newSalary.c[0]
					}
				), previous])
			})
			.then(([result, previous]) => resolve(result))
			.catch(([error, previous]) => {
				if(error.code === 'database') {
					// Rollback in case database write failed
					promisify(contract.instance.rollBack)({
						args: [
							previous.args.rowId.c[0],
							previous.args.prevRootHash
						]
					})
				}
				reject({
					'id': employee.id,
					'error': error
				})
			})

		// Integrity check of data record failed
		events.watch(contract.instance.IntegrityCheckFailedEvent)
			.then((result) => {
				reject({
					'id' : employee.id,
					'error' : 'Integrity check failed.'
				})
			})
		
		// Position of salary in employee record (-1 because id is shifted)
		const indexOfSalary = Object.keys(employee).indexOf('salary') - 1

		// Create array of leaves from employee object and shift id
		const leaves = Object.values(employee)
		leaves.shift()

		// Construct merkle tree and get proof
		const tree = new MerkleTree(leaves, sha3)
		const proof = tree.getProof(indexOfSalary)

		// Increase salary request for single employee
		promisify(contract.instance.increaseSalarySingleEmployee)({
			args: [
				employee.id,
				proof.checks,
				proof.indexOfFirstLeaf,
				proof.hashes,
				proof.values
			]
		})
			.then(result => transactionHash = result)
			.catch(handler)

	})

}

/**
 * Increase the salary of all affected employee. Affected employees are defined in a payraise contract.
 * 
 * @param {String} payRaiseContractAddress The address of the payraise contract
 * @returns {Promise} A promise that depends on the successful salary increase
 */
function increaseSalary(payRaiseContractAddress) {

	return new Promise((resolve, reject) => {

		const handler = (err) => reject(err)
		let finalResult = []

		// Smart contract needs data
		events.watch(contract.instance.RetrieveDataEvent)
			.then(result => {
				let department = web3.toUtf8(result.args.department)
				return db.readAll({department: department})
			})
			.then(result => {
				return result.reduce((promise, item) => { // Create one promise chain for all items
					return promise
						.then((result) => increaseSalarySingleEmployee(item.dataValues))
						.then(result => finalResult.push(result[1][0]))
						.catch(error => finalResult.push(error))
				}, Promise.resolve())
			})
			.then(result => resolve(finalResult))
			.catch(handler)

		// Increase salary request for all employees, which are returned from the database
		promisify(contract.instance.requestIncreaseSalary)({args: payRaiseContractAddress})
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
	addEmployeeToDatabase,
	getRootHash,
	getAll,
	importEmployees,
	increaseSalary,
	setInstance,
	hasInstance
}
