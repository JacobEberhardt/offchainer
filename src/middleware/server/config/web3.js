// Import dependencies
const web3 = require('web3')

// Define values
PROVIDER_URL = 'http://localhost:8545'

// Create instance
var instance = new web3()
instance.setProvider(new instance.providers.HttpProvider(PROVIDER_URL))

// Export module
module.exports = instance
