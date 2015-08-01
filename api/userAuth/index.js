'use strict';

var config = require('../../config/environment');
var express = require('express');
var controller = require('./userAuth.controller');

var router = express.Router();

router.post('/validateToken', controller.validateToken);
router.post('/signUp', controller.signUp);
router.post('/login', controller.login);
router.post('/changePassword', controller.changePassword);
router.post('/forgetPassword', controller.forgetPassword);
router.post('/setup', controller.setup);
router.post('/register', controller.register);

module.exports = router;
