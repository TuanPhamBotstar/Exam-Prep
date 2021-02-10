let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let UserSchema = new Schema({
    username: String,
    password: String,
    fullname: String,
    email: String,
    tested: Array,
})

module.exports = mongoose.model('User', UserSchema);