// Import dependencies
const Offchainer = artifacts.require('Offchainer')
const Counter = artifacts.require('Counter')
const Financials = artifacts.require('Financials')


// Export module
module.exports = deployer => {
    deployer.deploy(Offchainer)
    deployer.deploy(Counter)
    deployer.deploy(Financials)
}