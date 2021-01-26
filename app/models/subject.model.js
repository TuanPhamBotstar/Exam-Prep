let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let SubjectSchema = new Schema({
    subjectname: String,
    questionQty: Number,
    testQty: Number,
})

module.exports = mongoose.model('Subject', SubjectSchema);