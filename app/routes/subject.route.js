const express = require('express');
const Router = express.Router();

const subjectController = require('../controller/subject.controller');

Router.post('/', subjectController.postSubject);
Router.get('/author/:id/:page', subjectController.getSubjects);
Router.get('/:author/:subjectname', subjectController.getSubjectsByName);
Router.get('/:id', subjectController.getSubjectName);
Router.delete('/delete/:id', subjectController.delSubject);
module.exports = Router;