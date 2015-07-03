'use strict';
var _ = require("lodash");
var userService = require('./user.service');
var authHelper = require('./authHelper');

var handleError = function(res, err){

    var error = JSON.parse(err);
    return res.json(500, error);
}


exports.login = function(req,res){

    userService.getUser(req.body._id).then(function(response){

        var user = response.body;

        if(user.hashedPassword && req.body.password &&
            user.hashedPassword === authHelper.encryptPassword(req.body.password,req.body.salt)){

            var token = authHelper.makeToken(user._id);
            res.json(200,token);

        }
        else{

            handleError(res,"Credential failure");

        }


    }).fail(function(failedRes){

        handleError(res, failedRes.body);

    });


};

exports.signUp = function(req,res){

    var userObj = {};

    userObj.name = req.body.name;
    userObj.email = req.body.email;
    userObj.salt = authHelper.makeSalt();
    userObj.hashedPassword = authHelper.encryptPassword(req.body.password,userObj.salt);

    userService.createUser(userObj).then(function(response){

        var createdUser = JSON.parse(response.body);

        var token = authHelper.makeToken(createdUser._id);
        res.json(200,{token:token});

    }).fail(function(failedRes){

        handleError(res,failedRes.body);

    });
};

exports.forgetPassword = function(req,res){

};

exports.changePassword = function(req,res){


};


exports.validateToken = function(req,res){

    authHelper.validateToken(req.body.token, function(result,err){
        if(err){
            return handleError(res,JSON.stringify({error:"invalid token"}));
        }

        res.json(200,result);
    });

};
