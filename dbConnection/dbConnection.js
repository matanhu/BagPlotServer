var mysql = require('mysql');

var connection = mysql.createConnection({
    host: '10.0.0.8',
    user: 'matan',
    password: '01111987',
    database: 'BagPlot'
});

function connectDB(query, values, callback) {
    try {
        connection.query(query,values, function(error, rows, fields) {
            callback(error, rows, fields);
        });
    } catch(ex) {
        console.log(ex);
        callback(ex, null, null);
    }
}

module.exports.connectDB = connectDB;