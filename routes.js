/**
* Main application routes
*/

'use strict';


module.exports = function(app) {

    // Insert routes below
    app.use('/userAuth', require('./api/userAuth'));
    //app.use('/apiAuth', require('./api/apiAuth'));

    app.route('/*').get(function(req,res){
        res.status(404).send('Not found');
    });

};
