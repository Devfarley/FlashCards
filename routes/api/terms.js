const express = require('express');
const { readTerms, createTerms } = require('../../data/terms');
const router = express.Router();

router.get('/', (req, res) => {
    readTerms().then(data => {
        res.send(data)
    })
})

router.post('/', (req, res) => {
    const body = req.body
    createTerms(body).then(data => {
        res.send(data)
    })
})

module.exports = router;
