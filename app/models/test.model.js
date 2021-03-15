let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let TestSchema = new Schema({
    subject_id:String,
    link:String,
    testCode:String,
    testTitle:String,
    timeTest: String,
    hardQty: Number,
    normalQty: Number,
    easyQty: Number,
    questions:Array,
    typeCode: Boolean,
    author: String,
});

module.exports = mongoose.model('Test', TestSchema);
