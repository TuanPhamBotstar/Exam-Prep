const express = require('express')
const router = express.Router()

const controller = require('../controller/result.controller')

router.post('/', controller.saveResult)
router.get('/:id', controller.getResult)
router.get('/author/:author', controller.getResByAuthor)
module.exports = router;