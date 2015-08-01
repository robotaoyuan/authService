'use strict';
var _ = require("lodash");
var userService = require('./user.service');
var authHelper = require('./authHelper');

var handleError = function(res, err){

    return res.json(500, err);
}


exports.login = function(req,res){

    var query = {email: req.body.email};

    userService.searchUser(query).then(function(users){

        if(users && users.length > 0){
            var user = users[0];

            if(!user.verified){
                return handleError(res,{error:"User is not verified."});
            }
            if(user.hashedPassword && req.body.password && user.hashedPassword === authHelper.encryptPassword(req.body.password, user.salt)){
                var token = authHelper.makeToken(user._id);
                res.json(200,{token:token});
            }
            else{

                handleError(res,{error:"Credential failure"});

            }
        }
        else{
            handleError(res,{error:"No user with this email."});
        }


    })
    .fail(function(reason){

        handleError(res, reason);

    });


};

exports.signUp = function(req,res){

    var userObj = {};

    userObj.name = req.body.name;
    userObj.email = req.body.email;
    userObj.salt = authHelper.makeSalt();
    userObj.hashedPassword = authHelper.encryptPassword(req.body.password,userObj.salt);
    userObj.verified = false;
    userObj.verificationToken = authHelper.encryptPassword(req.body.name,userObj.salt);

    userService.createUser(userObj).then(function(response){

        var createdUser = JSON.parse(response.body);

        var token = authHelper.makeToken(createdUser._id);
        createdUser.token = token;
        createdUser.name = userObj.name;
        createdUser.email = userObj.email;
        createdUser.verificationToken = userObj.verificationToken;
        res.json(200,createdUser);

    }).fail(function(reason){

        handleError(res,reason);

    });
};

exports.register = function(req,res){

    var query = {
        email: req.body.email
    };
    userService.searchUser(query).then(function(users){
        var user = users[0];
        if(user && !user.verified){
            var token = authHelper.makeToken(user._id);
            user.email = req.body.email;
            user.token = token;
            return res.json(200,user);
        }

        else{
            //create the user
            var userObj = {};
            userObj.email = req.body.email;
            userObj.salt = authHelper.makeSalt();
            userObj.verified = false;

            userService.createUser(userObj).then(function(createdUser){

                var token = authHelper.makeToken(createdUser._id);

                createdUser.email = userObj.email;
                createdUser.token = token;
                res.json(200,createdUser);

            }).fail(function(reason){

                handleError(res,reason);

            });
        }
    }).fail(function(reason){
        handleError(res,reason);
    });

}

exports.setup = function(req,res){

    userService.getUser(req.body._id).then(function(user){

        if(user.verified){

            return handleError(res, {error:"此用户已经注册！"});
        }
        else{

            var userObj = {};
            userObj.salt = authHelper.makeSalt();
            userObj.hashedPassword = authHelper.encryptPassword(req.body.password,userObj.salt);
            userObj.verified = true;

            userService.putUser(user._id,userObj).then(function(user){

                res.json(200,user);

            }).fail(function(reason){

                res.json(200,reason);

            });

        }


    })
    .fail(function(reason){

        handleError(res, reason);

    });


}

exports.forgetPassword = function(req,res){

    res.json(500,JSON.stringify({error:"unimplemented"}));

};

exports.changePassword = function(req,res){


    userService.getUser(req.body._id).then(function(user){

        if(user.hashedPassword && req.body.oldPassword && user.hashedPassword === authHelper.encryptPassword(req.body.oldPassword, user.salt)){


            var userObj = {};
            userObj.salt = authHelper.makeSalt();
            userObj.hashedPassword = authHelper.encryptPassword(req.body.newPassword,userObj.salt);


            userService.putUser(user._id,userObj).then(function(response){
                res.json(200,response);

            }).fail(function(reason){
                res.json(200,reason);

            });



        }

        else{
            handleError(res,{error:"Credential error"});
        }


    })
    .fail(function(reason){

        handleError(res, reason);

    });
};


exports.validateToken = function(req,res){

    authHelper.validateToken(req.body.token, function(result,err){
        if(err){
            return handleError(res,{error:"invalid token"});
        }

        res.json(200,result);
    });

};
