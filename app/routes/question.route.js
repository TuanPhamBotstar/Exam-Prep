const express = require('express');
const router = express.Router();

const controller = require('../controller/question.controller');
const { route } = require('./test.route');

router.post('/', controller.postQuestion);
router.get('/:subject_id/:page', controller.getQuestions);
router.get('/:subject_id', controller.getQtyqs);
router.post('/test', controller.getQuestionsForTest);
router.delete('/:id', controller.delQuestion);

module.exports = router;