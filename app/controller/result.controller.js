const Result = require('../models/result.model')


module.exports.saveResult = (req, res) => {
    const result = req.body
    console.log('save tested',req.body)
    const newResult = new Result({
        user_id: result.user_id,
        test_id: result.test_id,
        author: result.author,
        nameTest: result.nameTest,
        point: result.point,
        time: result.time,
        chosenAnswers: result.chosenAnsers,
        correctAnswer: result.correctAnswer,
    });
    newResult.save();
    res.status(201).json({ success: true, message: 'Result is saved' })
}

module.exports.getResult = (req, res) => {
    const user_id = req.params.id;
    console.log('get result')
    Result.find({user_id: user_id}, (err, results) => {
        if(err) console.log(err)
        res.status(200).json(results);
    })
}