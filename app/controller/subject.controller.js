const { json } = require("body-parser");
const Subject = require("../models/subject.model");

module.exports.getSubjects = (req, res) => {
    console.log('user_id', req.params)
    const user_id = req.params.id;
    const page = req.params.page;
    const perPage = 9;
    Subject.find({ author: user_id }, (err, subjects) => {
        if (err) throw err;
        const total = subjects.length
        let limit = page*perPage
        let start = perPage*(page - 1)
        const subjectsOnePage=[];
        for(let i=start;i<limit;i++){
            if(i<total){
                subjectsOnePage.push(subjects[i])
            }
            else{
                break;
            }
        }
        res.status(200).send({subjectsOnePage: subjectsOnePage, total: total});
        // res.status(200).send(subjects);
    });
};

module.exports.getSubjectName = (req, res) => {
    const findSubjectname = req.params.id;
    console.log('req.params', req.params)
    Subject.findOne({ _id: findSubjectname }, (err, subject) => {
        if (err) console.log(err);
        if (subject) {
            res.status(200).json({ subjectname: subject.subjectname, author: subject.author });
        }
        else {
            res.status(200).json(null)
        }
    })
}

module.exports.postSubject = (req, res) => {
    console.log('req.body', req.body);
    const newSubject = new Subject({
        subjectname: req.body.subjectname,
        questionQty: req.body.questionQty,
        testQty: req.body.testQty,
        author: req.body.author,
    });
    console.log(newSubject)
    newSubject.save();
    console.log(json('newSubject', newSubject));
    res.status(201).json(newSubject);
    // res.status(201).json({ subject_id: newSubject._id, success: true, message: 'Subject is created' });
};

module.exports.delSubject = (req, res) => {
    const id = req.params.id;
    console.log('remove subject id', req.params)
    Subject.find({ _id: id })
        .deleteOne()
        .exec((err, result) => {
            if (err) console.log(err);
            console.log(result);
        })
    res.status(200).json(id);
}
