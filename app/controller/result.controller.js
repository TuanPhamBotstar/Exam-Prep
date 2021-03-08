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
    else if (time === 'all'){
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
    const startDate = getTime(time).startDate;
    const endDate = getTime(time).endDate;
    var dateArr;
    var userArr;
    console.log('get result', req.params)
    console.log('startDate', startDate);
    Result.aggregate([
        {
            $match: 
                {
                    user_id: user_id,
                    date: {
                        $gt: new Date(startDate),
                        $lt: new Date(endDate)
                    },
                }
        },
        {
            $project: {
                chosenAnswers: 1,
                date: 1,
                nameTest: 1,
                point: 1,
                time: 1,
                user_name: 1,
                test_id: 1,
            }
        }
    ]).exec((err, results) => {
        if (err) console.log(err)
        if(results){
            const startDay = new Date(startDate);
            const endDay = new Date(endDate);
            const diff = Math.floor((Date.parse(endDay) - Date.parse(startDay))/86400000);
            console.log('diff', diff)
            dateArr = [];
            userArr = [];
            for (let i = diff; i >= 0; i--) {
                userArr.push(0);
                dateArr.push(`${new Date(endDate - i * 24 * 60 * 60 * 1000).getDate()}/${new Date(endDate - i * 24 * 60 * 60 * 1000).getMonth() + 1}`);
            }
            results.forEach(result => {
                const tempDay = `${new Date(result.date).getDate()}/${new Date(result.date).getMonth() + 1}`;
                if (dateArr.includes(tempDay)) {
                    userArr[dateArr.indexOf(tempDay)]++;
                }
            })
        }

        res.status(200).json({ results: results, dateArr: dateArr, userArr: userArr, startDate: startDate, endDate: endDate });
    })
    // Result.find({
    //     user_id: user_id,
    //     date: {
    //         $gt: new Date(startDate),
    //         $lt: new Date(endDate)
    //     }
    // }, (err, results) => {
    //     if (err) console.log(err)
    //     res.status(200).json({ results: results, startDate: startDate, endDate: endDate });
    // })

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
                const startDay = new Date(startDate);
                const endDay = new Date(endDate);
                const diff = Math.floor((Date.parse(endDay) - Date.parse(startDay))/86400000);
                dateArr = [];
                dayArr = [];
                userArr = [];
                for (let i = diff; i >= 0; i--) {
                    userArr.push(0);
                    dayArr.push(new Date(endDate - i * 24 * 60 * 60 * 1000).getDate())
                    // show day/month
                    dateArr.push(`${new Date(endDate - i * 24 * 60 * 60 * 1000).getDate()}/${new Date(endDate - i * 24 * 60 * 60 * 1000).getMonth() + 1}`);
                }
                results.forEach(result => {
                    // new Date(result.date).getDate()
                    const tempDay = `${new Date(result.date).getDate()}/${new Date(result.date).getMonth() + 1}`;
                    if (dateArr.includes(tempDay)) {
                        userArr[dateArr.indexOf(tempDay)]++;
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
    const author = req.params.author;
    console.log('get result by test', req.params)
    var dateArr;
    var dayArr;
    var userArr;
    var correctQty = [];
    var inCorrectQty = [];
    const chosensArr = [];
    const rangePoint = [85, 70, 55, 40, 0];
    var avgScore =0;
    const evaluate = 
        { weak: 0, belowAverage: 0 , average: 0 , good: 0 ,  excellent: 0 };
    const scores = [];
    const qtyScores =[];
    const startDate = getTime(time).startDate;
    const endDate = getTime(time).endDate;
    console.log('startDate', startDate)
    // 
    Result.aggregate([
        {
            $match:
            {   
                author: author,
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
                chosenAnswers: 1,
                correctAnswer: 1,
                // "evaluate": { $range: [ 0, "$point", 10 ] }
            }
        },
    ])
        .exec((err, results) => {
            if (err) console.log(err)
            console.log('results: ',results)
            if (results.length > 0) {
                const startDay = new Date(startDate);
                const endDay = new Date(endDate);
                const diff = Math.floor((Date.parse(endDay) - Date.parse(startDay))/86400000);
                console.log('diff', diff)
                dateArr = [];
                dayArr = [];
                userArr = [];
                for (let i = diff; i >= 0; i--) {
                    userArr.push(0);
                    dayArr.push(new Date(endDate - i * 24 * 60 * 60 * 1000).getDate())
                    dateArr.push(`${new Date(endDate - i * 24 * 60 * 60 * 1000).getDate()}/${new Date(endDate - i * 24 * 60 * 60 * 1000).getMonth() + 1}`);
                }
                console.log(userArr, dateArr)
                results.forEach((result,idx) => {
                    if(idx === 0){
                        correctAnswer = result.correctAnswer
                    }
                    chosensArr.push(result.chosenAnswers);
                    let score = result.point;
                    if(scores.includes(score)){
                        qtyScores[scores.indexOf(score)]++;
                    }
                    else{
                        scores.push(score);
                        qtyScores.push(1);
                    }
                    avgScore += result.point;
                    if (score >= 85) {
                        evaluate.excellent++;
                    }
                    else if (score >= 70) {
                        evaluate.good++;
                    }
                    else if(score >= 55) {
                        evaluate.average++;
                    }
                    else if(score >= 40) {
                        evaluate.belowAverage++;
                    }
                    else if(score < 40){
                        evaluate.weak++;
                    }
                    const tempDay = `${new Date(result.date).getDate()}/${new Date(result.date).getMonth() + 1}`;
                    if (dateArr.includes(tempDay)) {
                        userArr[dateArr.indexOf(tempDay)]++;
                    }
                    // if (dayArr.includes(new Date(result.date).getDate())) {
                    //     userArr[dayArr.indexOf(new Date(result.date).getDate())]++;
                    // }
                })
                // statics question
                correctQty = Array(correctAnswer.length).fill(0)
                for(let i =0; i< chosensArr.length; i++){
                    for(let j =0; j< correctAnswer.length; j++){
                        if(chosensArr[i][j] === correctAnswer[j]){
                            correctQty[j]++;
                        }
                    }
                }
                for(let i = 0; i < correctQty.length; i++){
                    inCorrectQty[i] = chosensArr.length - correctQty[i];
                }
                // console.log(inCorrectQty,correctQty)
                avgScore = (avgScore/results.length).toFixed(2);
                console.log(avgScore)
                const userScore = {qtyScores: qtyScores.reverse() ,scores: scores.reverse()}
                res.status(200).json({ results: results, 
                    dateArr: dateArr, 
                    userArr: userArr, 
                    evaluate: evaluate, 
                    avgScore: avgScore, 
                    userScore: userScore,
                    staticQuestions: {
                        correctQty: correctQty,
                        inCorrectQty: inCorrectQty,
                        totalQs: correctAnswer.length,
                    } 
                });
            }
            else{
                res.status(200).json(
                    {   results: results,
                        evaluate: [],
                        avgScore: [],
                        userScore: {qtyScores: [] ,scores: []},
                        staticQuestions: {
                            correctQty: [],inCorrectQty: [], totalQs:0
                        },
                        userArr: [],
                        dateArr: [endDate],
                    })
            }
        });
}
module.exports.getResBySubject = (req, res) => {
    const author = req.params.author;
    const subject_id = req.params.subject_id;
    console.log('aggregate', req.params)
    Test.aggregate([
        { $match: { author: author, subject_id: subject_id } },
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
