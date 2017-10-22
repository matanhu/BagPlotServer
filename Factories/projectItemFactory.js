var dbConnection = require('../dbConnection/dbConnection');
var projectItemModel = require('../models/project_item');

function createProjecrItem(projectItem, callback) {
    var date_created = new Date();
    dbConnection.connectDB('INSERT INTO project_item (project_item_name, description, image, date_created, project_id) values (?, ?, ?, ?, ?)',
    [projectItem.project_item_name, projectItem.description, projectItem.image, date_created, projectItem.project_id],
    function(error, rows, fields) {
        var project_item = new projectItemModel();
        if(!!error) {
            console.error("createProject: " + error);
            project_item.isSuccess = false;
            project_item.errorMessage = error.code;
            callback(project_item);
        } else {
            if(rows && rows.insertId) {
                project_item.id = rows.insertId;
                project_item.project_item_name = projectItem.project_item_name;
                project_item.description = projectItem.description;
                project_item.image = projectItem.image;
                project_item.date_created = date_created;
                project_item.project_id = projectItem.project_id;
                project_item.isSuccess = true;
                callback(project_item);
            } else {
                console.error("createProject: Cannot insert new project");
                project_item.isSuccess = false;
                project_item.errorMessage = 'Cannot insert new project';
                callback(project_item);
            }
        }
    });
}

function getProjectItemsByProjectId(projectId, callback) {
    dbConnection.connectDB(
        `select id, project_item_name, description, image, date_created from project_item
        where project_id = ?`,
    [projectId],
    function(error, rows, fields) {
        var projectItems = new projectItemModel();
        if(!!error) {
            console.error("createProject: " + error);
            projectItems.isSuccess = false;
            projectItems.errorMessage = error.code;
            callback(projectItems);
        } else {
            if(rows) {
                var res = {
                    isSuccess: true,
                    projectItems: rows
                };
                callback(res);
            } else {
                console.error("getProjectItemsByProjectId: Cannot get getProjectItemsByProjectId");
                projectItems.isSuccess = false;
                projectItems.errorMessage = 'Cannot get getProjectItemsByProjectId';
                callback(projectItems);
            }
        }
    });
}

function getProjectItemById(projectItemId, callback) {
    dbConnection.connectDB(
        `select * from project_item
        where id = ?`,
    [projectItemId],
    function(error, rows, fields) {
        var projectItem = new projectItemModel();
        if(!!error) {
            console.error("createProject: " + error);
            projectItem.isSuccess = false;
            projectItem.errorMessage = error.code;
            callback(projectItem);
        } else {
            if(rows) {
                projectItem = rows[0];
                projectItem.isSuccess = true;
                callback(projectItem);
            } else {
                console.error("getProjectItemById: Cannot get getProjectItemById");
                projectItem.isSuccess = false;
                projectItem.errorMessage = 'Cannot get getProjectItemById';
                callback(projectItem);
            }
        }
    });
}

function updateProjectItem(projectItemReq, callback) {
    dbConnection.connectDB('UPDATE project_item SET project_item_name = ?, description = ?, image = ? WHERE id = ?',
    [projectItemReq.project_item_name, projectItemReq.description, projectItemReq.image, projectItemReq.id],
    function(error, rows, fields) {
        var projectItem = new projectItemModel();
        if(!!error) {
            console.error("createProject: " + error);
            projectItem.isSuccess = false;
            projectItem.errorMessage = error.code;
            callback(projectItem);
        } else {
            if(rows && rows.changedRows) {
                projectItem.id = projectItemReq.id;
                projectItem.project_name = projectItemReq.project_name;
                projectItem.description = projectItemReq.description;
                projectItem.image = projectItemReq.image;
                projectItem.isSuccess = true;
                callback(projectItem);
            } else {
                console.error("updateProject: Cannot Update project");
                projectItem.isSuccess = false;
                projectItem.errorMessage = 'Cannot Update project';
                callback(projectItem);
            }
        }
    });
}

module.exports.createProjecrItem = createProjecrItem;
module.exports.getProjectItemsByProjectId = getProjectItemsByProjectId;
module.exports.getProjectItemById = getProjectItemById;
module.exports.updateProjectItem = updateProjectItem;
