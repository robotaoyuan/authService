'use strict';

var requestify = require('requestify');
var config = require('../../config/environment');
var userServiceUrl = 'http://' + config.userIp + ':' + config.userPort;
var authHelper = require('./authHelper');

exports.getUser = function(userId){
    return requestify.get(userServiceUrl+"/api/users/"+ userId);
};

exports.searchUser = function(query){

    var url = userServiceUrl+"/api/users?";

    for(var key in query){

        url = url + key + '=' + query[key];
    }

    return requestify.get(url);
}

exports.createUser = function(userObj){

    return requestify.post(userServiceUrl+"/api/users/",userObj);
};

exports.putUser = function(userId, userObj){

    return requestify.put(userServiceUrl+"/api/users/"+userId,userObj);
};
