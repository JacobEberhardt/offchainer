// Import dependencies
const web3 = require('web3')

// Define values
PROVIDER_URL = 'http://testrpc:8545'

// Create instance
const instance = new web3()
instance.setProvider(new instance.providers.HttpProvider(PROVIDER_URL))

// Export module
module.export = instance
