var dbConnection = require('../dbConnection/dbConnection');
var contactModel = require('../models/contact');

function createContact(contactReq, callback) {
    var date_created = new Date();
    // dbConnection.connectDB(`INSERT INTO BagPlot.Contact 
    dbConnection.connectDB(`INSERT INTO Contact 
    (firstName, lastName, phoneOffice, faxNumber, cellular, email, date_created, project_id) 
    values (?, ?, ?, ?, ?, ?, ?, ?)`,
    [contactReq.firstName, contactReq.lastName, contactReq.phoneOffice, contactReq.faxNumber, contactReq.cellular, contactReq.email, date_created, contactReq.project_id],
    function(error, rows, fields) {
        var contact = new contactModel();
        if(!!error) {
            console.error("createProject: " + error);
            contact.isSuccess = false;
            contact.errorMessage = error.code;
            callback(contact);
        } else {
            if(rows && rows.insertId) {
                contact.id = rows.insertId;
                contact.firstName = contactReq.firstName;
                contact.lastName = contactReq.lastName;
                contact.phoneOffice = contactReq.phoneOffice;
                contact.faxNumber = contactReq.faxNumber;
                contact.cellular = contactReq.cellular;
                contact.email = contactReq.email;
                contact.date_created = date_created;
                contact.project_id = contactReq.project_id;
                contact.isSuccess = true;
                callback(contact);
            } else {
                console.error("createProject: Cannot insert new project");
                contact.isSuccess = false;
                contact.errorMessage = 'Cannot insert new project';
                callback(contact);
            }
        }
    });
}

function getContacsByProjectId(projectId, callback) {
    dbConnection.connectDB('SELECT * FROM Contact where project_id = ?',
    [projectId],
    function(error, rows, fields) {
        if(!!error) {
            var contact = new contactModel();
            contact.isSuccess = false;
            contact.errorMessage = error.code;
            console.error("getContacsByProjectId: " + error);
            callback(contact);
        } else {
            var res = {
                isSuccess: true,
                contacts: rows
            }
            callback(res);
        }
    });
}
 

module.exports.createContact = createContact;
module.exports.getContacsByProjectId = getContacsByProjectId;

