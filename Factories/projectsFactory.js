var dbConnection = require('../dbConnection/dbConnection');
var projectModel = require('../models/project');


function getAllProjects(callback) {
    // dbConnection.connectDB('SELECT * FROM BagPlot.Project;', 
    dbConnection.connectDB('SELECT * FROM Project;', 
        null, 
        function(error, rows, fields) {
            if(!!error) {
                var project = new projectModel();
                project.isSuccess = false;
                project.errorMessage = error.code;
                console.error("getAllProjects: " + error);
                callback(project);
            } else {
                var res = {
                    isSuccess: true,
                    projects: rows
                }
                callback(res);
            }
        }
    );
    
}

function createProject(projectReq, callback) {
    var date_created = new Date();
    // dbConnection.connectDB('INSERT INTO BagPlot.Project (customer_id, project_name, description, date_created) values (?, ?, ?, ?)',
    dbConnection.connectDB('INSERT INTO Project (customer_id, project_name, description, date_created) values (?, ?, ?, ?)',
    [projectReq.customer_id, projectReq.project_name, projectReq.description, date_created],
    function(error, rows, fields) {
        var project = new projectModel();
        if(!!error) {
            console.error("createProject: " + error);
            project.isSuccess = false;
            project.errorMessage = error.code;
            callback(project);
        } else {
            if(rows && rows.insertId) {
                project.id = rows.insertId;
                project.project_name = projectReq.project_name;
                project.description = projectReq.description;
                project.isSuccess = true;
                callback(project);
            } else {
                console.error("createProject: Cannot insert new project");
                project.isSuccess = false;
                project.errorMessage = 'Cannot insert new project';
                callback(project);
            }
        }
    });
}

function updateProject(projectReq, callback) {
    dbConnection.connectDB('UPDATE Project SET project_name = ?, description = ?, image = ? WHERE id = ?',
    [projectReq.project_name, projectReq.description, projectReq.image, projectReq.id],
    function(error, rows, fields) {
        var project = new projectModel();
        if(!!error) {
            console.error("createProject: " + error);
            project.isSuccess = false;
            project.errorMessage = error.code;
            callback(project);
        } else {
            if(rows && rows.changedRows) {
                project.id = projectReq.id;
                project.project_name = projectReq.project_name;
                project.description = projectReq.description;
                project.image = projectReq.image;
                project.isSuccess = true;
                callback(project);
            } else {
                console.error("updateProject: Cannot Update project");
                project.isSuccess = false;
                project.errorMessage = 'Cannot Update project';
                callback(project);
            }
        }
    });
}

function getProjectById(projectReq, callback) {
    dbConnection.connectDB(
        `select * from project
        where id = ?`,
    [projectReq.id],
    function(error, rows, fields) {
        var project = new projectModel();
        if(!!error) {
            console.error("createProject: " + error);
            project.isSuccess = false;
            project.errorMessage = error.code;
            callback(project);
        } else {
            if(rows) {
                callback(rows);
            } else {
                console.error("updateProject: Cannot Update project");
                project.isSuccess = false;
                project.errorMessage = 'Cannot Update project';
                callback(project);
            }
        }
    });
}

module.exports.getAllProjects = getAllProjects;
module.exports.createProject = createProject;
module.exports.updateProject = updateProject;
module.exports.getProjectById = getProjectById;