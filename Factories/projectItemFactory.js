var dbConnection = require('../dbConnection/dbConnection');
var projectItemModel = require('../models/project_item');

function createProjecrItem(projectItem, callback) {
    var date_created = new Date();
    dbConnection.connectDB('INSERT INTO Project_item (project_item_name, description, image, date_created, project_id) values (?, ?, ?, ?, ?)',
    [projectItem.name, projectItem.description, projectItem.image, date_created, projectItem.project_id],
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
        `select id, project_item_name, date_created from Project_item
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
                callback(rows);
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
        `select * from Project_item
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
                callback(rows[0]);
            } else {
                console.error("getProjectItemById: Cannot get getProjectItemById");
                projectItem.isSuccess = false;
                projectItem.errorMessage = 'Cannot get getProjectItemById';
                callback(projectItem);
            }
        }
    });
}

module.exports.createProjecrItem = createProjecrItem;
module.exports.getProjectItemsByProjectId = getProjectItemsByProjectId;
module.exports.getProjectItemById = getProjectItemById;