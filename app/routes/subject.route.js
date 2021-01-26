const express = require('express');
const Router = express.Router();

const subjectController = require('../controller/subject.controller');

Router.post('/', subjectController.postSubject);
Router.get('/', subjectController.getSubjects);
Router.get('/:subjectname', subjectController.getSubjectByName);
Router.delete('/delete/:id', subjectController.delSubject);
module.exports = Router;