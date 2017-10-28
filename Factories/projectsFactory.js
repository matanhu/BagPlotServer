var dbConnection = require('../dbConnection/dbConnection');
var projectModel = require('../models/project');
var projectItemFactory = require('./projectItemFactory');
var contactFactory = require('./contactFactory');


// function getCountOfProjects(callback) {
function getCountOfProjects(callback) {
    // dbConnection.connectDB('SELECT * FROM BagPlot.Project;', 
    dbConnection.connectDB('SELECT count(*) FROM Project;',
        null,
        function (error, rows, fields) {
            if (!!error) {
                var res = {
                    isSuccess: false,
                    errorMessage: error.code
                }
                console.error("getCountOfProjects: " + error);
                callback(res);
            } else {
                var res = {
                    isSuccess: true,
                    countProjects: rows[0]['count(*)']
                }
                callback(res);
            }
        }
    );

}

function getAllProjects(callback) {
    // dbConnection.connectDB('SELECT * FROM BagPlot.Project;', 
    dbConnection.connectDB(`select customer_name, project_name, description, image, proj.date_created, proj.id from
                            (SELECT * FROM project) as proj
                            join 
                            (SELECT * FROM customer) as cust
                            on proj.customer_id like cust.id
                            order by proj.date_created desc;`,
        null,
        function (error, rows, fields) {
            if (!!error) {
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

function searchProject(searchText, callback) {
    // dbConnection.connectDB('SELECT * FROM BagPlot.Project;', 
    dbConnection.connectDB(`select * from
    (select customer_name, project_name, description, image, project.date_created, project.id from customer  join project
    on customer.id = project.customer_id) as cust_proj
    where cust_proj.project_name like ? or customer_name like ?
    order by date_created desc;`,
        ["%"+searchText+"%", "%"+searchText+"%"],
        function (error, rows, fields) {
            if (!!error) {
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
        function (error, rows, fields) {
            var project = new projectModel();
            if (!!error) {
                console.error("createProject: " + error);
                project.isSuccess = false;
                project.errorMessage = error.code;
                callback(project);
            } else {
                if (rows && rows.insertId) {
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
        function (error, rows, fields) {
            var project = new projectModel();
            if (!!error) {
                console.error("createProject: " + error);
                project.isSuccess = false;
                project.errorMessage = error.code;
                callback(project);
            } else {
                if (rows && rows.changedRows) {
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

function deleteProjectById(projectId, callback) {
    dbConnection.connectDB(
        `delete from Project
        where id = ?`,
        [projectId],
        function (error, rows, fields) {
            var project = new projectModel();
            if (!!error) {
                console.error("createProject: " + error);
                project.isSuccess = false;
                project.errorMessage = error.code;
                callback(project);
            } else {
                var res = {
                    isSuccess: true,
                    project: rows
                }
                callback(res);
            }
        });
}

function getProjectById(projectReq, callback) {
    dbConnection.connectDB(
        `select * from Project
        where id = ?`,
        [projectReq.id],
        function (error, rows, fields) {
            var project = new projectModel();
            if (!!error) {
                console.error("createProject: " + error);
                project.isSuccess = false;
                project.errorMessage = error.code;
                callback(project);
            } else {
                if (rows) {
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

function getProjectByIdClient(projectReq, callback) {
    dbConnection.connectDB(
        `select * from Project
        where id = ?`,
        [projectReq],
        function (error, rows, fields) {
            var project = new projectModel();
            if (!!error) {
                console.error("createProject: " + error);
                project.isSuccess = false;
                project.errorMessage = error.code;
                callback(project);
            } else {
                if (rows) {
                    projectItemFactory.getProjectItemsByProjectId(projectReq, function (projectItemsRes) {
                        if (projectItemsRes.isSuccess) {
                            contactFactory.getContacsByProjectId(projectReq, function (contactRes) {
                                if (contactRes.isSuccess) {
                                    project = rows[0];
                                    project.itemsProject = projectItemsRes.projectItems;
                                    project.contacts = contactRes.contacts;
                                    project.isSuccess = true;
                                    callback(project);
                                } else {
                                    console.error("getProjectByIdClient: Cannot get contacts" + projectReq);
                                    project.isSuccess = false;
                                    project.errorMessage = 'Cannot get contacts' + projectReq;
                                    callback(project);
                                }
                            });
                        } else {
                            console.error("getProjectByIdClient: Cannot get project items" + projectReq);
                            project.isSuccess = false;
                            project.errorMessage = 'Cannot get project items' + projectReq;
                            callback(project);
                        }
                    });
                } else {
                    console.error("getProjectByIdClient: Cannot get project" + projectReq);
                    project.isSuccess = false;
                    project.errorMessage = 'Cannot get project' + projectReq;
                    callback(project);
                }
            }
        });
}

module.exports.getAllProjects = getAllProjects;
module.exports.createProject = createProject;
module.exports.updateProject = updateProject;
module.exports.getProjectById = getProjectById;
module.exports.getProjectByIdClient = getProjectByIdClient;
module.exports.getCountOfProjects = getCountOfProjects;
module.exports.searchProject = searchProject;
module.exports.deleteProjectById = deleteProjectById;
