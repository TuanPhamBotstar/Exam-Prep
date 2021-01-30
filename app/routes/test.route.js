const express = require('express');
const router = express.Router();

const testContoller = require('../controller/test.controller');

router.get('/:id', testContoller.getTest);
router.get('/testing/:id', testContoller.getTesting);
router.get('/subject/:subject_id', testContoller.getTestsBySubject_id);
router.post('/', testContoller.postTest);
router.post('/check', testContoller.checkAnswers);
router.put('/', testContoller.putQuestions);
router.delete('/:id', testContoller.delTest);

module.exports = router;