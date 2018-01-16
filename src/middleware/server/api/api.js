// Import dependencies
const router = require('express').Router()
const res = require('../utils/response')
const offchainer = require('./routes/offchainer')
const counter = require('./routes/counter')
const counterMutiple = require('./routes/counterMultiple')
const counterOnchain = require('./routes/counterOnchain')
const employee = require('./routes/employee')
const payraise = require('./routes/payraise')

// Set response functions
const error = res.error

// Routes
router.use('/offchainer', offchainer)
router.use('/counter', counter)
router.use('/counter-multiple', counterMutiple)
router.use('/counterOnchain', counterOnchain)
router.use('/employee', employee)
router.use('/payraise', payraise)

// 404 fallback
router.all('/*', (req, res, next) => error(res, 404))

// Export module
module.exports = router
