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
var documentFactory = require('./Factories/documentFactory');
var projectItemFactory = require('./Factories/projectItemFactory');

var port=Number(process.env.PORT || 3000);

app.get('/api/getAllCustomers', function(req, res) {
    customersFactory.getAllCustomers(function(customerList) {
        res.send(customerList);
    });
});

app.post('/api/getCustomersByName', function(req,res) {
    var customer_name = req.body.customer_name;
    customersFactory.getCustomersByName(customer_name, function(customersList) {
        res.send(customersList);
    });
});

app.post('/api/createCustomer', function(req,res) {
    var customer_name = req.body.customer_name;
    customersFactory.createCustomer(customer_name, function(customer) {
        res.send(customer);
    });
});

app.get('/api/getCountOfProjects', function(req, res) {
    projectsFactory.getCountOfProjects(function(projectCount) {
        res.send(projectCount);
    });
});

app.get('/api/getAllProjects', function(req, res) {
    projectsFactory.getAllProjects(function(projectList) {
        res.send(projectList);
    });
});

app.get('/api/getProjectByIdClient/:id', function(req, res) {
    var projectId = req.param('id');
    projectsFactory.getProjectByIdClient(projectId, function(projectRes) {
        res.send(projectRes);
    });
});

app.post('/api/createProject', function(req,res) {
    var project = req.body;
    projectsFactory.createProject(project, function(project) {
        res.send(project);
    });
});

app.put('/api/updateProject', function(req,res) {
    var project = req.body;
    projectsFactory.updateProject(project, function(project) {
        res.send(project);
    });
});

app.post('/api/createContact', function(req, res) {
    var contact = req.body;
    contactFactory.createContact(contact, function(contact) {
        res.send(contact);
    });
});

// app.post('/createDocx/:projectId', function(req, res) {
app.post('/api/createDocx/', function(req, res) {
    var project = req.body;
    var hostUrl = req.get('host');
    console.log('req.get("host"): ' + req.get('host'));
    console.log('req.originalUrl: ' + req.originalUrl );
    // var project = {
    //     id: req.param('projectId')
    // }
    documentFactory.createDocx(project, hostUrl, function(file) {
        console.log(file);
        // docx.generate(res);
        // res.setHeader('Content-disposition', 'attachment; filename=BagPlot');
        // res.sendfile(file.tempFile);
        res.send({
            filePath: 'http://' + hostUrl + '/api/dowloadDocx/' + file.projectId + '/' + file.tempFile
        });
    });
});

app.get('/api/dowloadDocx/:projectId/:filename', function(req,res) {
    var projectId = req.param('projectId');
    var filename = req.param('filename');
    documentFactory.dowloadDocx(projectId, filename, function(file) {
        // res.setHeader('Content-disposition', 'attachment; filename=' + filename);
        res.download(file.tempFile);
    });
});

app.post('/api/createProjecrItem/', function(req,res) {
    var projectItem = req.body;
    projectItemFactory.createProjecrItem(projectItem, function(projectItemRes){
        res.send(projectItemRes);
    });
});

app.get('/api/getProjectItemById/:projectItemId', function(req, res) {
    var projectItemId = req.param('projectItemId');
    projectItemFactory.getProjectItemById(projectItemId, function(projectItemRes) {
        res.send(projectItemRes);
    });
});

app.put('/api/updateProjectItem/', function(req, res) {
    var projectItem = req.body;
    projectItemFactory.updateProjectItem(projectItem, function(projectItemRes) {
        res.send(projectItemRes);
    });
});
console.log(port);
app.listen(port);

