const { json } = require("body-parser");
const Question = require("../models/question.model");

module.exports.postQuestion = (req,res) => {
    console.log('req.body',req.body);
    let newQuestion = new Question({
        title:req.body.title,
        answers:req.body.answers,
        level:req.body.level,
        test_id:req.body.test_id,
        subject_id:req.body.subject_id  ,
    });
    newQuestion.save();
    console.log('newQuestion',newQuestion)
    res.status(201).json(newQuestion);
}

module.exports.getQuestions = (req, res) => {
    const id = req.params.subject_id;
    console.log('get questions for subject')
    Question.find({subject_id:id},(err, questions)  => {
        if(err) console.log(err);
        res.status(200).send(questions);
    })
}

function getQs(qty, qsArr){
    const total = qsArr.length;
    let idxArr = [];
    let res = [];
    let l = 0;
    while(l < qty){
        idxArr.push(Math.floor(total*Math.random()))
        idxArr=[... new Set(idxArr)];
        l = idxArr.length;
    }
    idxArr.forEach(idx => {
        res.push(qsArr[idx]);
    })
    return res;
}
module.exports.getQuestionsForTest = (req, res) => {
    const id = req.body.subject_id;
    const test_id = req.body._id;
    console.log('id test', req.body._id)
    const hardQty = req.body.hardQty;
    const normalQty = req.body.normalQty;
    const easyQty = req.body.easyQty; 
    const hardQs = [];
    const normalQs = [];
    const easyQs = [];
    // console.log('test', req.body)
    Question.find({subject_id: id}, (err, questions) => {
        if(err) console.log(err);
        questions.forEach(question => {
            if(question.level == 1){
                easyQs.push(question);
            }
            else if(question.level == 2){
                normalQs.push(question);
            }
            else{
                hardQs.push(question);
            }
        })
        const res1 = getQs(easyQty, easyQs);
        const res2 = getQs(normalQty, normalQs);
        const res3 = getQs(hardQty, hardQs);
        const qsForTest = res1.concat(res2,res3);
        res.status(200).send({test_id: test_id, questions: qsForTest});
    })
    
}

module.exports.delQuestion = (req, res) =>{
    const id = req.params.id;
    console.log('id del',id)
    Question.findOne({_id: id})
    .deleteOne()
    .exec((err, result) =>{
        if(err) console.log(err);
        console.log(result);
    })
    res.status(204).send(id);
}






