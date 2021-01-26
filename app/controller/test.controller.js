const { json } = require('body-parser');
const Test = require('../models/test.model');
const { connect } = require('../routes/test.route');

module.exports.postTest = (req, res) => {
    console.log('create new test body req', req.body)
    const newTest = new Test({
        subject_id: req.body.subject_id,
        link: req.body.link,
        testCode: req.body.testCode,
        testTitle: req.body.testTitle,
        timeTest: req.body.timeTest,
        hardQty: req.body.hardQty,
        normalQty: req.body.normalQty,
        easyQty: req.body.easyQty,
    });
    newTest.save();
    console.log('new test', newTest)
    res.status(201).send(newTest);
}

module.exports.putQuestions = (req, res) => {
    const id = req.body.test_id;
    const qsForTest = req.body.questions;
    const test = Test.where({_id:id});
    test.updateOne({$set: {questions: qsForTest}}).exec();
    res.status(200).send({message:'Get questions for test successfully'});
}

module.exports.getTest = (req, res) => {
    const id = req.params.id;
    console.log('get test by id', req.params)
    Test.findOne({_id: id}, (err, test) => {
        if (err) console.log(err);
        console.log(test)
        res.status(200).send(test);
    })
}