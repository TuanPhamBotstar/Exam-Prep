const { json } = require("body-parser");
const Subject = require("../models/subject.model");

module.exports.getSubjects = (req, res) => {
    console.log('user_id', req.params)
    const user_id = req.params.id;
    Subject.find({author: user_id}, (err, subjects) => {
        if (err) throw err;
        res.status(200).send(subjects);
        // res.json({'message': 'Hello World'})
    });
};

module.exports.getSubjectName = (req, res) => {
    const findSubjectname = req.params.id;
    console.log('req.params', req.params)
    Subject.findOne({ _id: findSubjectname }, (err, subject) => {
        if (err) console.log(err);
        if(subject){
            res.status(200).json({subjectname: subject.subjectname, author: subject.author});
        }
        else{
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
    res.status(201).json({ subject_id: newSubject._id, success: true, message: 'Subject is created' });
};

module.exports.delSubject = (req, res) => {
    const id = req.params.id;
    console.log('req.params id', req.params)
    Subject.find({ _id: id })
        .deleteOne()
        .exec((err, result) => {
            if (err) console.log(err);
            console.log(result);
        })
    res.status(204).send({ success: id });
}
