var dbConnection = require('../dbConnection/dbConnection');
var userModel = require('../models/user');

function createUser(userReq, callback) {
    var date_created = new Date();
    dbConnection.connectDB(`INSERT INTO User 
    (uid, firstName, lastName, cellular, email, date_created) 
    values (?, ?, ?, ?, ?, ?)`,
    [userReq.uid, userReq.firstName, userReq.lastName, userReq.cellular, userReq.email, date_created],
    function(error, rows, fields) {
        var user = new userModel();
        if(!!error) {
            console.error("createUser: " + error);
            user.isSuccess = false;
            user.errorMessage = error.code;
            callback(user);
        } else {
            if(rows) {
                user.uid = userReq.uid;
                user.firstName = userReq.firstName;
                user.lastName = userReq.lastName;
                user.cellular = userReq.cellular;
                user.email = userReq.email;
                user.date_created = date_created;
                user.isSuccess = true;
                callback(user);
            } else {
                console.error("createUser: Cannot insert new user");
                user.isSuccess = false;
                user.errorMessage = 'Cannot insert new user';
                callback(user);
            }
        }
    });
}

module.exports.createUser = createUser;