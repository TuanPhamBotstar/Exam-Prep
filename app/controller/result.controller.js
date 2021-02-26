const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const Result = require('../models/result.model')
const Test = require('../models/test.model')
const Subject = require('../models/subject.model');
module.exports.saveResult = (req, res) => {
    const result = req.body
    console.log('save tested', req.body)
    const newResult = new Result({
        user_name: result.user_name,
        user_id: result.user_id,
        test_id: result.test_id,
        author: result.author,
        nameTest: result.nameTest,
        point: result.point,
        time: result.time,
        chosenAnswers: result.chosenAnsers,
        correctAnswer: result.correctAnswer,
        date: result.date,
    });
    newResult.save();
    res.status(201).json({ success: true, message: 'Result is saved' })
}
function getTime(time) {
    const currentDate = new Date(Date.now());
    var startDate, endDate;
    if (time === 'day') {
        startDate = currentDate.setHours(0, 0, 0, 0);
        endDate = currentDate.setHours(23, 59, 59, 999);
    }
    else if (time === 'week') {
        const today = currentDate.getDay();
        startDate = new Date(currentDate.setHours(0, 0, 0, 0) - (today) * 24 * 60 * 60 * 1000);
        endDate = currentDate.setHours(23, 59, 59, 999);
    }
    else if (time === 'month') {
        const today = currentDate.getDate();
        startDate = new Date(currentDate.setHours(0, 0, 0, 0) - (today - 1) * 24 * 60 * 60 * 1000);
        endDate = currentDate.setHours(23, 59, 59, 999);
    }
    else {
        startDate = new Date('2021-02-01T09:58:51.694Z').setHours(0, 0, 0, 0);
        endDate = currentDate.setHours(23, 59, 59, 999);
    }
    return { startDate: startDate, endDate: endDate }
}
module.exports.getResult = (req, res) => { // get results by user
    const user_id = req.params.id;
    const time = req.params.time;
    const currentDate = new Date(Date.now());
    // const endDate = new Date(Date.now() - 7* 24 * 60 * 60 * 1000);
    // var startDate, endDate;
    const startDate = getTime(time).startDate;
    const endDate = getTime(time).endDate;

    console.log('get result', req.params)
    console.log('startDate', startDate);
    Result.find({
        user_id: user_id,
        date: {
            $gt: new Date(startDate),
            $lt: new Date(endDate)
        }
    }, (err, results) => {
        if (err) console.log(err)
        res.status(200).json({ results: results, startDate: startDate, endDate: endDate });
    })

}

module.exports.getResByAuthor = (req, res) => {
    const author = req.params.author;
    const time = req.params.time;
    console.log('get res by author', req.params)
    var dateArr;
    var dayArr;
    var userArr;
    const startDate = getTime(time).startDate;
    const endDate = getTime(time).endDate;
    console.log('startDate', startDate)
    // 
    Result.aggregate([
        {
            $match:
            {
                author: author,
                date: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                },
            },
        },
        {
            $sort: { point: -1, time: 1 }
        },
        {
            $project: {
                point: 1,
                user_name: 1,
                time: 1,
                date: 1,
                user_id: 1,
            }
        },
    ])
        .exec((err, results) => {
            if (err) console.log(err)
            console.log(results)
            if (results) {
                const startDay = new Date(startDate).getDate();
                const endDay = new Date(endDate).getDate();
                dateArr = [];
                dayArr = [];
                userArr = [];
                for (let i = endDay-startDay; i >= 0; i--) {
                    userArr.push(0);
                    dayArr.push(new Date(endDate - i * 24 * 60 * 60 * 1000).getDate())
                    dateArr.push(`${new Date(endDate - i * 24 * 60 * 60 * 1000).getDate()}/${new Date(endDate - i * 24 * 60 * 60 * 1000).getMonth() + 1}`);
                  }
                results.forEach(result => {
                    if(dayArr.includes(new Date(result.date).getDate())){
                        userArr[dayArr.indexOf(new Date(result.date).getDate())]++;
                      }
                })
                res.status(200).json({ results: results, dateArr: dateArr, userArr: userArr });
            }
        });
    // Result.find({ author: author }, (err, results) => {
    //     if (err) console.log(err)
    //     res.status(200).json(results);
    // })
}
module.exports.getResByTest = (req, res) => {
    const test_id = req.params.test_id;
    const time = req.params.time;
    console.log('get result by test', req.params)
    var dateArr;
    var dayArr;
    var userArr;
    const startDate = getTime(time).startDate;
    const endDate = getTime(time).endDate;
    console.log('startDate', startDate)
    // 
    Result.aggregate([
        {
            $match:
            {
                test_id: test_id,
                date: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                },
            },
        },
        {
            $sort: { point: -1, time: 1 }
        },
        {
            $project: {
                point: 1,
                user_name: 1,
                time: 1,
                date: 1,
                user_id: 1,
            }
        },
    ])
        .exec((err, results) => {
            if (err) console.log(err)
            console.log(results)
            if (results) {
                const startDay = new Date(startDate).getDate();
                const endDay = new Date(endDate).getDate();
                dateArr = [];
                dayArr = [];
                userArr = [];
                for (let i = endDay-startDay; i >= 0; i--) {
                    userArr.push(0);
                    dayArr.push(new Date(endDate - i * 24 * 60 * 60 * 1000).getDate())
                    dateArr.push(`${new Date(endDate - i * 24 * 60 * 60 * 1000).getDate()}/${new Date(endDate - i * 24 * 60 * 60 * 1000).getMonth() + 1}`);
                  }
                results.forEach(result => {
                    if(dayArr.includes(new Date(result.date).getDate())){
                        userArr[dayArr.indexOf(new Date(result.date).getDate())]++;
                      }
                })
                res.status(200).json({ results: results, dateArr: dateArr, userArr: userArr });
            }
        });
}
module.exports.getResBySubject = (req, res) => {
    const author = req.params.author;
    const subject_id = req.params.subject_id;
    console.log('aggregate', req.params)
    Test.aggregate([
        { $match: { subject_id: subject_id } },
        {
            $project: {
                _id: {
                    $toString: "$_id",
                },
                testTitle: 1
            }
        },
        {
            $lookup: {
                from: 'results',
                localField: '_id',
                foreignField: 'test_id',
                as: 'results'
            },
        },
        // { $unwind: '$results' },
        {
            $project: {
                _nameTest: "$testTitle",
                score: "$results.point",
            }
        },
        {
            $addFields: {
                totalUsers: { $size: "$score" }
            }
        },
        {
            $project: {
                _id: "$_nameTest",
                totalUsers: 1,
                avgScore: { $avg: "$score" }
            }
        },
        {
            $sort: { avgScore: -1 }
        },
    ])
        .exec((err, results) => {
            if (err) console.log(err)
            console.log(results)
            if (results) {
                res.status(200).json(results)
            }
        })
}
