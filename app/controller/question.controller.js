const { json } = require("body-parser");
const Question = require("../models/question.model");
const paginate = require('mongoose-paginate')
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
    console.log('pagi', req.params)
    const id = req.params.subject_id;
    const page = req.params.page;
    const perPage = 10;
    console.log('get questions for subject')
    Question.find({subject_id:id},(err, questions)  => {
        if(err) console.log(err);
        const total = questions.length
        let limit = page*perPage
        let start = perPage*(page - 1)
        const qsOnePage=[];
        for(let i=start;i<limit;i++){
            if(i<total){
                qsOnePage.push(questions[i])
            }
            else{
                break;
            }
        }
        res.status(200).send({qsOnePage: qsOnePage, total: total});
    })
}
// module.exports.getQuestions = (req, res) => {
//     var perPage = 10, page = Math.max(0, 1)
//     Question.find({subject_id:'6015113bebbc213668917667'})
//     .select('subject_id')
//     .limit(perPage)
//     .skip(perPage * page)
//     // .sort({
//     //     subject_id: 'asc'
//     // })
//     .exec(function(err, events) {
//         Question.countDocuments().exec(function(err, count) {
//             console.log(count)
//         })
//     })
// }
function getQs(qty, qsArr){
    const total = qsArr.length;
    if(qty > total) return -1;
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
        if(res1 === -1 || res2 === -1 || res3 === -1){
            res.status(200)
            .send({susscess: false, easyTotal: easyQs.length, normalTotal: normalQs.length, hardTotal: hardQs.length});
        }
        else{
            const qsForTest = res1.concat(res2,res3);
            res.status(200).send({susscess: true, questions: qsForTest});
        }
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






