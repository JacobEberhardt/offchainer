// Import dependencies
const Counter = artifacts.require('Counter')
const Employee = artifacts.require('Employee')
const PayRaise = artifacts.require('PayRaise')
const Financials = artifacts.require('Financials')

// Export module
module.exports = deployer => {
	deployer.deploy(Counter)
	deployer.deploy(Employee)
	deployer.deploy(PayRaise)
	deployer.deploy(Financials)
}
