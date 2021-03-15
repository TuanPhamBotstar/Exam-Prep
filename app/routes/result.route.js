const express = require('express')
const router = express.Router()

const controller = require('../controller/result.controller')

router.post('/', controller.saveResult)
router.get('/:id/:time', controller.getResult)
router.get('/admin/:author/:time', controller.getResByAuthor)
router.get('/dashboard/:author/:subject_id/', controller.getResBySubject)
router.get('/test/:author/:test_id/:time', controller.getResByTest)
module.exports = router;