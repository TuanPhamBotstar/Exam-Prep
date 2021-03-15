let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let QuestionSchema = new Schema({
    title:String,
    answers:Array,
    level:Number,
    test_id:String,
    subject_id:String,
})


module.exports = mongoose.model('Question', QuestionSchema);