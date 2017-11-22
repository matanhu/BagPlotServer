var express = require('express');
var mysql = require('mysql');
var bodyParser = require("body-parser");
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
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
var firebaseFactory = require('./Factories/firebaseFactory');
var userFactory = require('./Factories/userFactory');

var port = Number(process.env.PORT || 3000);

app.get('/api/getAllCustomers', function (req, res) {
    customersFactory.getAllCustomers(function (customerList) {
        res.send(customerList);
    });
});

app.post('/api/getCustomersByName', function (req, res) {
    var customer_name = req.body.customer_name;
    customersFactory.getCustomersByName(customer_name, function (customersList) {
        res.send(customersList);
    });
});

app.post('/api/createCustomer', function (req, res) {
    var customer_name = req.body.customer_name;
    customersFactory.createCustomer(customer_name, function (customer) {
        res.send(customer);
    });
});

app.get('/api/getCountOfProjects', function (req, res) {
    projectsFactory.getCountOfProjects(function (projectCount) {
        res.send(projectCount);
    });
});

app.get('/api/getAllProjects', function (req, res) {
    projectsFactory.getAllProjects(function (projectList) {
        res.send(projectList);
    });
});

app.get('/api/searchProject/:searchText?', function (req, res) {
    var searchText = '';
    if (req.param('searchText')) {
        searchText = req.param('searchText');
    }
    projectsFactory.searchProject(searchText, function (projectList) {
        res.send(projectList);
    });
})

app.get('/api/getProjectByIdClient/:id', function (req, res) {
    var projectId = req.param('id');
    projectsFactory.getProjectByIdClient(projectId, function (projectRes) {
        res.send(projectRes);
    });
});

app.delete('/api/deleteProjectById/:id', function (req, res) {
    var projectId = req.param('id');
    projectsFactory.deleteProjectById(projectId, function (projectRes) {
        res.send(projectRes);
    });
});

app.post('/api/createProject', function (req, res) {
    var project = req.body;
    projectsFactory.createProject(project, function (project) {
        res.send(project);
    });
});

app.put('/api/updateProject', function (req, res) {
    var project = req.body;
    projectsFactory.updateProject(project, function (project) {
        res.send(project);
    });
});

app.post('/api/createContact', function (req, res) {
    var contact = req.body;
    contactFactory.createContact(contact, function (contact) {
        res.send(contact);
    });
});

// app.post('/createDocx/:projectId', function(req, res) {
app.post('/api/createDocx/', function (req, res) {
    var project = req.body.project;
    var emailTo = req.body.emailTo;
    var hostUrl = req.get('host');
    console.log('req.get("host"): ' + req.get('host'));
    console.log('req.originalUrl: ' + req.originalUrl);
    // var project = {
    //     id: req.param('projectId')
    // }
    documentFactory.createDocx(project, emailTo, hostUrl, function (file) {
        console.log(file);
        // docx.generate(res);
        // res.setHeader('Content-disposition', 'attachment; filename=BagPlot');
        // res.sendfile(file.tempFile);
        res.send({
            filePath: 'http://' + hostUrl + '/api/dowloadDocx/' + file.projectId + '/' + file.tempFile,
            isSuccess: file.isSuccess
        });
    });
});

app.get('/api/dowloadDocx/:projectId/:filename', function (req, res) {
    var projectId = req.param('projectId');
    var filename = req.param('filename');
    documentFactory.dowloadDocx(projectId, filename, function (file) {
        // res.setHeader('Content-disposition', 'attachment; filename=' + filename);
        res.download(file.tempFile);
    });
});

app.post('/api/createProjecrItem/', function (req, res) {
    var projectItem = req.body;
    projectItemFactory.createProjecrItem(projectItem, function (projectItemRes) {
        res.send(projectItemRes);
    });
});

app.get('/api/getProjectItemById/:projectItemId', function (req, res) {
    var projectItemId = req.param('projectItemId');
    projectItemFactory.getProjectItemById(projectItemId, function (projectItemRes) {
        res.send(projectItemRes);
    });
});

app.put('/api/updateProjectItem/', function (req, res) {
    var projectItem = req.body;
    projectItemFactory.updateProjectItem(projectItem, function (projectItemRes) {
        res.send(projectItemRes);
    });
});

app.post('/api/signup', function (req, res) {
    var signupModel = req.body;
    userFactory.createUser(signupModel, function (userRes) {
        res.send(userRes);
    });
});

app.post('/api/signin', function (req, res) {
    var token = req.body;
    firebaseFactory.verifyIdToken(token.token)
        .then(function (decodedToken) {
            var uid = decodedToken.uid;
            var signinRes = {
                isSuccess: true
            }
            res.send(signinRes);
        }).catch(function (error) {
            var signinRes = {
                isSuccess: false,
                error: error
            }
            res.send(signinRes);
        });
});

// app.post('/api/signin', function (req, res) {
//     var signinModel = req.body;
//     firebaseFactory.signinUserByEmail(signinModel)
//         .then(function (userRecord) {
//             // See the UserRecord reference doc for the contents of userRecord.
//             console.log("Successfully signin user:", userRecord.uid);
//             res.send(userRecord);
//         })
//         .catch(function (error) {
//             console.log("Error signin user:", error);
//         });
// });
console.log(port);
app.listen(port);

