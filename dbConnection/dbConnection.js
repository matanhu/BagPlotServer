var mysql = require('mysql');

// var db_config = {
//     host: '10.0.0.8',
//     user: 'matan',
//     password: '01111987',
//     database: 'BagPlot'
// };

var db_config = {
    host: 'eu-cdbr-west-01.cleardb.com',
    user: 'bb348118811fba',
    password: 'c9f3726afe20b3c',
    database: 'heroku_19e127df84aa4a7'
};

var connection;

function handleDisconnect() {
    connection = mysql.createConnection(db_config); // Recreate the connection, since
                                                    // the old one cannot be reused.
  
    connection.connect(function(err) {              // The server is either down
      if(err) {                                     // or restarting (takes a while sometimes).
        console.log('error when connecting to db:', err);
        setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
      }                                     // to avoid a hot loop, and to allow our node script to
    });                                     // process asynchronous requests in the meantime.
                                            // If you're also serving http, display a 503 error.
    connection.on('error', function(err) {
      console.log('db error', err);
      if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
        handleDisconnect();                         // lost due to either server restart, or a
      } else {                                      // connnection idle timeout (the wait_timeout
        throw err;                                  // server variable configures this)
      }
    });
}

handleDisconnect();

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
