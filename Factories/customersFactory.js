var dbConnection = require('../dbConnection/dbConnection');
var customerModel = require('../models/customer');


function getAllCustomers(callback) {
    // dbConnection.connectDB('SELECT * FROM BagPlot.Customer;', 
    dbConnection.connectDB('SELECT * FROM Customer;',
        null, 
        function(error, rows, fields) {
            if(!!error) {
                var customer = new customerModel();
                customer.isSuccess = false;
                customer.errorMessage = error.code;
                console.error("getAllCustomers: " + error);
                callback(customer);
            } else {
                var res = {
                    isSuccess: true,
                    customers: rows
                }
                callback(res);
            }
        }
    );    
}

function getCustomersByName(name, callback) {
    // dbConnection.connectDB('SELECT * FROM BagPlot.Customer where customer_name like ?',
    dbConnection.connectDB('SELECT * FROM Customer where customer_name like ?',
        ['%' + name + '%'],
        function(error, rows, fields) {
            if(!!error) {
                var customer = new customerModel();
                customer.isSuccess = false;
                customer.errorMessage = error.code;
                console.error("getCustomersByName: " + error);
                callback(customer);
            } else {
                var res = {
                    isSuccess: true,
                    customers: rows
                }
                callback(res);
            }
        }
    );
}

function getCustomersById(id, callback) {
    // dbConnection.connectDB('SELECT * FROM BagPlot.Customer where customer_name like ?',
    dbConnection.connectDB('SELECT * FROM Customer where id = ?',
        [id],
        function(error, rows, fields) {
            if(!!error) {
                var customer = new customerModel();
                customer.isSuccess = false;
                customer.errorMessage = error.code;
                console.error("getCustomersByName: " + error);
                callback(customer);
            } else {
                var res = {
                    isSuccess: true,
                    customers: rows
                }
                callback(res);
            }
        }
    );
}

function createCustomer(name, callback) {
    // dbConnection.connectDB('INSERT INTO BagPlot.Customer (customer_name) values (?)',
    dbConnection.connectDB('INSERT INTO Customer (customer_name) values (?)',
    [name],
    function(error, rows, fields) {
        var customer = new customerModel();
        if(!!error) {
            console.error("createCustomer: " + error);
            customer.isSuccess = false;
            customer.errorMessage = error.code;
            callback(customer);
        } else {
            if(rows && rows.insertId) {
                customer.id = rows.insertId;
                customer.customer_name = name;
                customer.isSuccess = true;
                callback(customer);
            } else {
                console.error("createCustomer: Cannot insert new customer");
                customer.isSuccess = false;
                customer.errorMessage = 'Cannot insert new customer';
                callback(customer);
            }
        }
    });
}

module.exports.getAllCustomers = getAllCustomers;
module.exports.getCustomersByName = getCustomersByName;
module.exports.createCustomer = createCustomer;
module.exports.getCustomersById = getCustomersById;
