const express = require('express');
const router = express.Router();

const controller = require('../controller/user.controller');

router.post('/', controller.login);
router.post('/signup',controller.postUser);
router.get('/', controller.getUsers);
router.get('/:id', controller.getUsername);

module.exports = router;