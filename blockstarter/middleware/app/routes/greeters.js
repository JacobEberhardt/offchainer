const express = require('express');
const router = express.Router();
const Greeter = require('../models/greeter');

// POST greeters
router.post('/', (req, res, next) => {
    Greeter.create(req.body.greeting, (err, greeter) => {
        if (typeof greeter.address !== 'undefined') {
            if (err) {
                res.json({ 'Error': err });
            } else {
                res.json({ 'address': greeter.address });
            }
        }
    });
});

// GET greeters/:address
router.get('/:address', (req, res, next) => {
    Greeter.get(req.params.address, (err, greeting) => {
        if (err) {
            if(err.name === 'BigNumber Error') {
                res.status(404);
                res.json({ 'Error': 'Greeter contract not found.' });
            } else {
                res.status(500);
                res.json({ 'Error': err });
            } 
        } else {
            res.json({ 'greeting': greeting });
        }
    });
});

// GET greeters/:address/blocknumber
router.get('/:address/blocknumber', (req, res, next) => {
    Greeter.getBlockNumber(req.params.address, (err, blocknumber) => {
        if (err) {
            if(err.name === 'BigNumber Error') {
                res.status(404);
                res.json({ 'Error': 'Greeter contract not found.' });
            } else {
                res.status(500);
                res.json({ 'Error': err });
            }
        } else {
            res.json({ 'blocknumber': blocknumber });
        }
    });
});

// PUT greeters/:address
router.put('/:address', (req, res, next) => {
    Greeter.update(req.body.greeting, req.params.address, (err, transaction) => {
        if (err) {
            if(err.name === 'BigNumber Error') {
                res.status(404);
                res.json({ 'Error': 'Greeter contract not found.' });
            } else {
                res.status(500);
                res.json({ 'Error': err });
            }
        } else {
            res.json({ 'transaction': transaction });
        }
    });
});

// DELETE greeter/:address
router.delete('/:address', (req, res, next) => {
    Greeter.delete(req.params.address, (err, transaction) => {
        if (err) {
            if(err.name === 'BigNumber Error') {
                res.status(404);
                res.json({ 'Error': 'Greeter contract not found.' });
            } else {
                res.status(500);
                res.json({ 'Error': err });
            }
        } else {
            res.json({ 'transaction': transaction });
        }
    });
});

module.exports = router;
