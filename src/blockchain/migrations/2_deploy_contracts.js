// Import dependencies
const Counter = artifacts.require('Counter')
const Employee = artifacts.require('Employee')
const Payraise = artifacts.require('Payraise')
const Financials = artifacts.require('Financials')

// Export module
module.exports = deployer => {
	deployer.deploy(Counter)
	deployer.deploy(Employee)
	deployer.deploy(Payraise)
	deployer.deploy(Financials)
}
