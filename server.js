var express = require('express');
var mysql = require('mysql');
var bodyParser = require("body-parser");
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });


var customersFactory = require('./Factories/customersFactory');
var projectsFactory = require('./Factories/projectsFactory');
var contactFactory = require('./Factories/contactFactory');

var port=Number(process.env.PORT || 3000);

app.get('/getAllCustomers', function(req, res) {
    customersFactory.getAllCustomers(function(customerList) {
        res.send(customerList);
    });
});

app.post('/getCustomersByName', function(req,res) {
    var customer_name = req.body.customer_name;
    customersFactory.getCustomersByName(customer_name, function(customersList) {
        res.send(customersList);
    });
});

app.post('/createCustomer', function(req,res) {
    var customer_name = req.body.customer_name;
    customersFactory.createCustomer(customer_name, function(customer) {
        res.send(customer);
    });
});

app.get('/getAllProjects', function(req, res) {
    projectsFactory.getAllProjects(function(projectList) {
        res.send(projectList);
    });
});

app.post('/createProject', function(req,res) {
    var project = req.body;
    projectsFactory.createProject(project, function(project) {
        res.send(project);
    });
});

app.put('/updateProject', function(req,res) {
    var project = req.body;
    projectsFactory.updateProject(project, function(project) {
        res.send(project);
    });
});

app.post('/createContact', function(req, res) {
    var contact = req.body;
    contactFactory.createContact(contact, function(contact) {
        res.send(contact);
    });
})

app.listen(port);
