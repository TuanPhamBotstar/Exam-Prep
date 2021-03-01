const express = require('express');
const router = express.Router();

const controller = require('../controller/question.controller');
const { route } = require('./test.route');

router.post('/', controller.postQuestion);
router.get('/bySubject/:author/:subject_id/:page', controller.getQuestions);
router.get('/:subject_id', controller.getQtyqs);
router.get('/edit/:id', controller.getQuestion);
router.post('/test', controller.getQuestionsForTest);
router.delete('/:id', controller.delQuestion);
router.put('/:id', controller.editQuestion);

module.exports = router;