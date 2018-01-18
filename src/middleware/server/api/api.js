// Import dependencies
const router = require('express').Router()
const res = require('../utils/response')
const offchainer = require('./routes/offchainer')
const counter = require('./routes/counter')
const counterMutiple = require('./routes/counterMultiple')
const counterOnchain = require('./routes/counterOnchain')
const employeeOnchain = require('./routes/employeeOnchain')
const payraiseOnchain = require('./routes/payraiseOnchain')
const employee = require('./routes/employee')
const payraise = require('./routes/payraise')
const financials = require('./routes/financials')

// Set response functions
const error = res.error

// Routes
router.use('/offchainer', offchainer)
router.use('/counter', counter)
router.use('/counter-multiple', counterMutiple)
router.use('/counterOnchain', counterOnchain)
router.use('/employeeOnchain', employeeOnchain)
router.use('/payraiseOnchain', payraiseOnchain)
router.use('/employee', employee)
router.use('/payraise', payraise)
router.use('/financials', financials)

// 404 fallback
router.all('/*', (req, res, next) => error(res, 404))

// Export module
module.exports = router