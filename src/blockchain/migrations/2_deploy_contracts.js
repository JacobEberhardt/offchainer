// Import dependencies
const Offchainer = artifacts.require('Offchainer')
const Counter = artifacts.require('Counter')

// Export module
module.exports = deployer => {
	deployer.deploy(Offchainer)
	deployer.deploy(Counter)
}
