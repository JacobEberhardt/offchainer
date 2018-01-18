// Import dependencies
const Offchainer = artifacts.require('Offchainer')
const Counter = artifacts.require('Counter')
const Employee = artifacts.require('Employee')
const PayRaise = artifacts.require('PayRaise')
const Financials = artifacts.require('Financials')

// Export module
module.exports = deployer => {
	deployer.deploy(Offchainer)
	deployer.deploy(Counter)
	deployer.deploy(Employee)
	deployer.deploy(PayRaise)
  deployer.deploy(Financials)
}