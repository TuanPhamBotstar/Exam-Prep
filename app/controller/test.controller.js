const { json } = require('body-parser');
const { findOne } = require('../models/test.model');
const Test = require('../models/test.model');
const { connect } = require('../routes/test.route');

module.exports.postTest = (req, res) => {
    console.log('create new test body req', req.body)
    const newTest = new Test({
        subject_id: req.body.subject_id,
        link: req.body.link,
        testCode: req.body.codeTest,
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
        if(test){
            res.status(200).send(test);
        }
    })
}
//hide answer'isCorrect
module.exports.getTesting = (req, res) => {
    const id = req.params.id;
    console.log('get test by id', req.params)
    Test.findOne({_id: id}, (err, test) => {
        if (err) console.log(err);
        if(test){
            test.questions.forEach(question => {
                question.answers.forEach(answer => {
                    answer.isCorrect = false
                })
            });
            res.status(200).send(test);
        }
    })
}

module.exports.getTestsBySubject_id = (req, res) =>{
    const id = req.params.subject_id;
    console.log('get test by subject_id', req.params)
    Test.find({subject_id:id}, (err, tests) =>{
        if(err) console.log(err);
        res.status(200).send((tests))
    })
}

module.exports.delTest = (req, res) => {
    console.log('del test', req.params)
    const id = req.params.id;
    Test.find({_id: id},)
        .deleteOne()
        .exec((err, result) => {
            if(err) console.log(err);
            console.log(result);
        })
    res.status(204).json({message:'test is deleted successfully'});
}

// check result
module.exports.checkAnswers = (req, res) => {
    console.log('check result',req.body)
    const chosenArr = req.body.chosenAnswers;
    const test_id = req.body.test_id;
    Test.findOne({_id: test_id}, (err, test) => {
        if(err) console.log(err)
        const correctAnswer = [];
        if(test){
            test.questions.forEach((question, index) => {
                question.answers.forEach((answer, idx) => {
                    if(answer.isCorrect){
                        correctAnswer[index] = idx;
                    }
                })
            })
            let count = 0;
            console.log(correctAnswer)
            correctAnswer.forEach((answer, idx) => {
                if(answer==chosenArr[idx]){
                    count++;
                }
            })
            const point = count*10;
            res.status(200).json({correctAnswer: correctAnswer, point: point})
        }
    })
}