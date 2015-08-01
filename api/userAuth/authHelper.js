'use strict';
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var config = require('../../config/environment');

exports.encryptPassword = function(password,salt) {
    if (!password || !salt) return '';
    var base64salt = new Buffer(salt, 'base64');
    return crypto.pbkdf2Sync(password, base64salt, 10000, 64).toString('base64');
};


exports.checkPassword = function(plainTextPwd,hashedPassword,salt){
    return this.encryptPassword(plainTextPwd,salt) === hashedPassword;
};


exports.makeSalt = function() {
    return crypto.randomBytes(16).toString('base64');
};

exports.makeToken = function(userId){
    return jwt.sign({ _id: userId }, config.secrets, { expiresInMinutes: config.sessionPeriod });
}


exports.validateToken = function(token,cb){
    var options = {secret:config.secrets};
    jwt.verify(token, options.secret, options, function(err, decoded) {
        if (err) return cb(null,err);

        cb(decoded);
    });
}
