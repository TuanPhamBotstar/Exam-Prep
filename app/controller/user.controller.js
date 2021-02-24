const { json } = require("body-parser");
const User = require("../models/user.model");
//hash password
const bcrypt = require("bcrypt");
const { getMaxListeners } = require("../models/user.model");
const { use } = require("../routes/user.route");
const saltRounds = 10;
// const myPlaintextPassword = 's0/\/\P4$$w0rD';
// const someOtherPlaintextPassword = 'not_bacon';
// const passwordHash = bcrypt.hashSync('Pa$$w0rd', 10);
// const verified = bcrypt.compareSync('Pa$$w0rd', passwordHash);

module.exports.login = (req, res) => {
    console.log('login',(req.body.username));
    const passwordLogin = req.body.password;
    const usernameLogin = req.body.username ? req.body.username.toLowerCase()
    : req.body.email.toLowerCase();
    console.log('idx', usernameLogin.indexOf('@'))
    if (usernameLogin.indexOf('@') >= 0) {
        User.findOne({ email: usernameLogin }, (err, user) => {
            if (err) console.log(err);
            console.log('userlogin is', user)
            if (user) {
                console.log('email', user.email);
                //
                const verified = bcrypt.compareSync(passwordLogin, user.password);
                console.log('verified', verified)
                if (verified) {
                    return res.json({ success: true, message: 'passwords is match', id: user._id, username: user.username });
                }
                else {
                    return res.json({ success: false, message: 'passwords do not match' });
                }

            }
            else {
                console.log('user not exist');
                return res.json({ success: false, message: 'username do no exist' });
            }
        });
    }
    else {
        User.findOne({ username: usernameLogin }, (err, user) => {
            if (err) console.log(err);
            if (user) {
                console.log('username', user.username);
                console.log('passwordLogin', passwordLogin)
                const verified = bcrypt.compareSync(passwordLogin, user.password);
                console.log('verified', verified)
                if (verified) {
                    return res.json({ success: true, message: 'passwords is match', id: user._id, username: user.username });
                }
                else {
                    return res.json({ success: false, message: 'passwords do not match' });
                }
            }
            else {
                console.log('user not exist')
                return res.json({ success: false, message: 'username do no exist' });
            }
        });
    }

};

module.exports.getUsers = (req, res) => {
    User.find({}, (err, users) => {
        if (err) console.log(err);
        res.status(200).send(users);
    });
};

module.exports.getUsername = (req, res) => {
    const id = req.params.id;
    console.log('get username', req.params)
    User.findOne({ _id: id }, (err, user) => {
        if (err) console.log(err) ;
        console.log(user)
        res.status(200).json(user.username);
    });
};

module.exports.postUser = (req, res) => {
    console.log(req.body);
    const username = req.body.username.toString().toLowerCase();
    const email = req.body.email.toString().toLowerCase();
    User.findOne({username: username}, (err, user) => {
        console.log('... tim kiem 1')
        if(err) console.log(err)
        if(user){
            console.log('uername is exist')
            res.status(200).json({ success: false, message: 'Username already exist' })
        }
        else{
            User.findOne({email: email}, (err, user) => {
                console.log('... tim kiem 2')
                if(err) console.log(err)
                if(user){
                    console.log('email is exist')
                    res.status(200).json({ success: false, message: 'Username already exist' })
                }
                else{
                    const hashpassword = bcrypt.hashSync(req.body.password, 10);
                    const newUser = new User({
                        username: username,
                        password: hashpassword,
                        fullname: req.body.fullname,
                        email: email,
                    });
                    newUser.save();
                    console.log(json('newUser', newUser));
                    res.status(201).json({ success: true, message: 'Account is created' });
                }
            })
        }
    })
};

