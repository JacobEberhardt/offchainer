// Import dependencies
const Contract = artifacts.require('Contract')

// Export module
module.exports = deployer => {
	deployer.deploy(Contract)
}