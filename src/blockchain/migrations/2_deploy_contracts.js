// Import dependencies
const Offchainer = artifacts.require('Offchainer')

// Export module
module.exports = deployer => {
	deployer.deploy(Offchainer)
}
