const express = require('express');
const router = express.Router();

const testContoller = require('../controller/test.controller');

router.get('/:id', testContoller.getTest)
router.post('/', testContoller.postTest);
router.put('/', testContoller.putQuestions);

module.exports = router;