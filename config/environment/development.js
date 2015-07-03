'use strict';

// Development specific configuration
// ==================================
module.exports = {
    sessionPeriod: 60*5,
    secrets: 'keystone-secret',
    userPort:  process.env.USER_PORT || 9000,
    userIp: process.env.USER_IP || "127.0.0.1"

};
