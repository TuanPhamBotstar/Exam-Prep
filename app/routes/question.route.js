const express = require('express');
const router = express.Router();

const controller = require('../controller/question.controller');

router.post('/', controller.postQuestion);
router.get('/:subject_id', controller.getQuestions);
router.post('/test', controller.getQuestionsForTest);
router.delete('/:id', controller.delQuestion);

module.exports = router;