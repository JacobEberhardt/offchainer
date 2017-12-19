// Import dependencies
const Offchainer = artifacts.require('Offchainer')
const Counter = artifacts.require('Counter')
const CounterMultiple = artifacts.require('CounterMultiple')
const CounterOnchain = artifacts.require('CounterOnchain')
const Employee = artifacts.require('Employee')
const Financials = artifacts.require('Financials')
const PayRaise = artifacts.require('PayRaise')

// Export module
module.exports = deployer => {
	deployer.deploy(Offchainer)
	deployer.deploy(Counter)
	deployer.deploy(CounterMultiple)
	deployer.deploy(CounterOnchain)
	deployer.deploy(Employee)
	deployer.deploy(Financials)
	deployer.deploy(PayRaise)
}
