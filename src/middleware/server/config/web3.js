// Import dependencies
const web3 = require('web3')

// Create instance
const instance = new web3()
instance.setProvider(new instance.providers.HttpProvider('http://testrpc:8545'))

// Export module
module.export = instance
