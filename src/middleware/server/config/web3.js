// Import dependencies
const web3 = require('web3')

// Define values
WEBTHREE_HOST = process.env.WEBTHREE_HOST || 'localhost'
PROVIDER_URL = 'http://' + WEBTHREE_HOST + ':7545'

// Create instance
var instance = new web3()
instance.setProvider(new instance.providers.HttpProvider(PROVIDER_URL))

// Export module
module.exports = instance
