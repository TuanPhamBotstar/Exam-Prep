const express = require('express')
const router = express.Router()

const controller = require('../controller/result.controller')

router.post('/', controller.saveResult)
router.get('/:id', controller.getResult)

module.exports = router;