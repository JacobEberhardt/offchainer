// Import dependencies
const router = require('express').Router()
const res = require('../utils/response')
const counter = require('./routes/counter')
const counterMutiple = require('./routes/counter-multiple')
const counterOnchain = require('./routes/counter-onchain')
const financialsOnchain = require('./routes/financials-onchain')
const employeeOnchain = require('./routes/employee-onchain')
const payraiseOnchain = require('./routes/payraise-onchain')
const employee = require('./routes/employee')
const payraise = require('./routes/payraise')
const financials = require('./routes/financials')

// Set response functions
const error = res.error

// Routes
router.use('/counter', counter)
router.use('/counter-multiple', counterMutiple)
router.use('/counter-onchain', counterOnchain)
router.use('/financials-onchain', financialsOnchain)
router.use('/employee-onchain', employeeOnchain)
router.use('/payraise-onchain', payraiseOnchain)
router.use('/employee', employee)
router.use('/payraise', payraise)
router.use('/financials', financials)

// 404 fallback
router.all('/*', (req, res, next) => error(res, 404))

// Export module
module.exports = router
