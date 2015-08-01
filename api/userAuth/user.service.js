'use strict';

var requestify = require('requestify');
var config = require('../../config/environment');
var userServiceUrl = 'http://' + config.userIp + ':' + config.userPort;
var authHelper = require('./authHelper');


function passResponse(response){
    var response = JSON.parse(response.body);
    return response;
}

function passFailure(failed){
    var parsed = JSON.parse(failed.body);
    throw parsed;
}

exports.getUser = function(userId){
    return requestify.get(userServiceUrl+"/api/users/"+ userId)
      .then(passResponse,passFailure);
};

exports.searchUser = function(query){

    var url = userServiceUrl+"/api/users?";

    for(var key in query){

        url = url + key + '=' + query[key];
    }

    return requestify.get(url).then(passResponse,passFailure);
}

exports.createUser = function(userObj){

    return requestify.post(userServiceUrl+"/api/users/",userObj).then(passResponse,passFailure);
};

exports.putUser = function(userId, userObj){

    return requestify.put(userServiceUrl+"/api/users/"+userId,userObj).then(passResponse,passFailure);
};
