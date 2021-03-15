const express = require('express');
const router = express.Router();

const testContoller = require('../controller/test.controller');

router.get('/detail/:author/:subject_id/:test_id', testContoller.getDetailTest);
router.get('/search/:author/:subject_id/:testTitle', testContoller.getTestsByName);
router.get('/gettypecode/:id', testContoller.getTypeCode);
router.get('/checkcode/:id/:typedCode', testContoller.checkCode)
router.get('/testing/:id', testContoller.getTesting);
router.get('/subject/:author/:subject_id', testContoller.getTestsBySubject_id);
router.post('/', testContoller.postTest);
router.post('/check', testContoller.checkAnswers);
router.put('/', testContoller.putTypecode)
// router.put('/', testContoller.putQuestions);
router.delete('/:id', testContoller.delTest);

module.exports = router;