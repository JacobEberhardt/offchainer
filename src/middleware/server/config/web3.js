// Import dependencies
const web3 = require('web3')

// Define values
WEBTHREE_HOST = process.env.WEBTHREE_HOST || process.env.DOCKERHOST || '127.0.0.1'
WEBTHREE_PORT = process.env.WEBTHREE_PORT || '7545'
PROVIDER_URL = 'http://' + WEBTHREE_HOST + ':' + WEBTHREE_PORT

console.log('expecting ganache at: ', PROVIDER_URL)

// Create instance
var instance = new web3()
instance.setProvider(new instance.providers.HttpProvider(PROVIDER_URL))

// Export module
module.exports = instance
