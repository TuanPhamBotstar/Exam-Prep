let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ResultSchema = new Schema({
    user_id: String,
    test_id: String,
    author: String,
    nameTest: String,
    point: Number,
    time: Number,
    chosenAnswers: Array,
    correctAnswer: Array,
})

module.exports = mongoose.model('Result', ResultSchema);