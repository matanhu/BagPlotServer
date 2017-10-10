var dbConnection = require('../dbConnection/dbConnection');
var projectModel = require('../models/project');


function getAllProjects(callback) {
    dbConnection.connectDB('SELECT * FROM BagPlot.Project;', 
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
    dbConnection.connectDB('INSERT INTO BagPlot.Project (customer_id, project_name, description, date_created) values (?, ?, ?, ?)',
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

module.exports.getAllProjects = getAllProjects;
module.exports.createProject = createProject;