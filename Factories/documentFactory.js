var officegen = require('officegen');
var fs = require('fs');
var async = require('async');
var request = require('request');
var projectsFactory = require('./projectsFactory');
var customersFactory = require('./customersFactory');
var contactFactory = require('./contactFactory');
var emailFactory = require('./emailFactory');
var projectItemFactory = require('./projectItemFactory');

function createDocx(projectReq, emailTo, hostUrl, callback) {
    try {
        var projectRes = null;
        var contactsRes = null;
        var customerRes = null;
        var projectItemsRes = null;
        projectsFactory.getProjectById(projectReq, function (dbProjectRes) {
            projectRes = dbProjectRes;
            customersFactory.getCustomersById(projectRes[0].customer_id, function (dbCustomerRes) {
                customerRes = dbCustomerRes.customers;
                contactFactory.getContacsByProjectId(projectRes[0].id, function (dbContactRes) {
                    contactsRes = dbContactRes.contacts;
                    projectItemFactory.getProjectItemsByProjectId(projectRes[0].id, function (dbItemsRes) {
                        projectItemsRes = dbItemsRes.projectItems;
                        generateDocxFile(projectRes, customerRes, projectItemsRes, contactsRes, emailTo, hostUrl, function (filename) {
                            callback(filename);
                        });
                    });
                });
            });
        });
    } catch (err) {
        var res = {
            isSuccess: false,
            message: err.message
        }
        callback(res);
    }
}

function generateDocxFile(projectRes, customerRes, projectItemsRes, contactsRes, emailTo, hostUrl, callback) {
    var docx = officegen({
        'type': 'docx', // or 'xlsx', etc
        'onend': function (written) {
            console.log('Finish to create a PowerPoint file.\nTotal bytes created: ' + written + '\n');
        },
        'onerr': function (err) {
            console.log(err);
        },
        'subject': projectRes[0].project_name,
        'description': projectRes[0].description
    });

    addProjectToDocs(projectRes, docx, function (docxWithProject) {
        addItemsToDocs(projectItemsRes, docx, function (docxWithItems) {
            addContactToDocx(contactsRes, docx, function (docxWithContacts) {
                createFolder(projectRes[0].id);
                var out = fs.createWriteStream(projectRes[0].id + "/" + projectRes[0].project_name + '.docx');
                docx.generate(out);
                out.on('close', function () {
                    // sendEmail();
                    var res = {
                        projectId: projectRes[0].id,
                        tempFile: projectRes[0].project_name + '.docx',
                        fileName: projectRes[0].project_name,
                    }
                    sendEmailWithLink(res, emailTo, hostUrl).then(() => {
                        res.isSuccess = true;
                        deleteFile(res);
                        callback(res);
                    }).catch((err) => {
                        res.isSuccess = false;
                        deleteFile(res);
                        callback(res);
                    })
                });
            });
        });
    });

}

function addProjectToDocs(project, docx, callback) {
    var pObjName = docx.createP({ rtl: true });
    pObjName.options.align = 'center'; // Also 'right' or 'jestify'
    pObjName.addText(project[0].project_name, { bold: true, underline: true });

    if (project.image) {
        download(project[0].image, 'project-' + project[0].id).then((res) => {
            var pObjImage = docx.createP({ rtl: true });
            pObjImage.options.align = 'center';
            console.log('done');
            pObjImage.addImage(fs.readFileSync('tempFiles/project-' + project[0].id + '.png'));
            var pObjDes = docx.createP({ rtl: true });
            pObjDes.options.align = 'right'; // Also 'right' or 'jestify'
            pObjDes.addText(project[0].description);
            callback(docx);
        });
    } else {
        var pObjDes = docx.createP({ rtl: true });
        pObjDes.options.align = 'right'; // Also 'right' or 'jestify'
        pObjDes.addText(project[0].description);
        callback(docx);
    }
}

function addItemsToDocs(items, docx, callback) {
    async.forEachOf(items, function (item, index, next) {
        var pObjName = docx.createP({ rtl: true });
        pObjName.options.align = 'right'; // Also 'right' or 'jestify'
        pObjName.addText(item.project_item_name, { bold: true, underline: true });

        if (item.image) {
            // pObjImage.addImage ( path.resolve(__dirname, 'myFile.png' ) );
            download(item.image, 'item-' + item.id).then((res) => {
                var pObjImage = docx.createP({ rtl: true });
                pObjImage.options.align = 'center';
                console.log('done');
                pObjImage.addImage(fs.readFileSync('tempFiles/item-' + item.id + '.png'));
                //pObjImage.addLineBreak ();
                var pObjDes = docx.createP({ rtl: true });
                pObjDes.options.align = 'right'; // Also 'right' or 'jestify'
                pObjDes.addText(item.description);
                pObjDes.addLineBreak();

                next();
            });
        } else {
            var pObjDes = docx.createP({ rtl: true });
            pObjDes.options.align = 'right'; // Also 'right' or 'jestify'
            pObjDes.addText(item.description);
            pObjDes.addLineBreak();

            next();
        }

        //   callback(docx);
        //   return docx;
    }, function (err) {
        callback(docx);
        console.log('iterating done');
    });
}

function addContactToDocx(contactsList, docx, callback) {
    for (var i = 0; i < contactsList.length; i++) {
        var pObj = docx.createP({ rtl: true });
        pObj.options.align = 'right'; // Also 'right' or 'jestify'
        pObj.addText('שם פרטי: ', { bold: true, underline: true });
        pObj.addText(contactsList[i].firstName);
        pObj.addLineBreak();
        pObj.addText('שם משפחה: ', { bold: true, underline: true });
        pObj.addText(contactsList[i].lastName);
        pObj.addLineBreak();
        pObj.addText('טלפון במשרד: ', { bold: true, underline: true });
        pObj.addText(contactsList[i].phoneOffice);
        pObj.addLineBreak();
        pObj.addText('פקס: ', { bold: true, underline: true });
        pObj.addText(contactsList[i].faxNumber);
        pObj.addLineBreak();
        pObj.addText('סלולאר: ', { bold: true, underline: true });
        pObj.addText(contactsList[i].cellular);
        pObj.addLineBreak();
        pObj.addText('דוא"ל: ', { bold: true, underline: true });
        pObj.addText(contactsList[i].email);
        // pObj.addLineBreak ();
        // pObj.addLineBreak ();
    }
    // return docx;
    callback(docx);
}

var download = function (uri, filename) {
    return new Promise((resolve, reject) => {
        try {
            createFolder('tempFiles');
            request.head(uri, function (err, res, body) {
                // request(uri).pipe(fs.createWriteStream('tempFiles/' + filename + '.png')).on('close', callback);
                request(uri).pipe(fs.createWriteStream('tempFiles/' + filename + '.png')).on('close', resolve);
            });
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

function createFolder(dir) {
    if (!fs.existsSync(dir.toString())) {
        fs.mkdirSync(dir.toString());
    }
}

function dowloadDocx(projectId, fileName, callback) {
    var res = {
        projectId: projectId,
        tempFile: projectId + '/' + fileName
    };

    callback(res);
}

function sendEmail() {
    var emailerWithAttachment = new emailFactory.emailerWithAttachment('out.docx');
    emailerWithAttachment.send();
}

function sendEmailWithLink(file, emailTo, hostUrl) {
    return new Promise((resolve, reject) => {
        var sendEmailWithLink = new emailFactory.sendEmailWithLink(file.fileName, 'http://' + hostUrl + '/api/dowloadDocx/' + file.projectId + '/' + file.tempFile, emailTo);
        sendEmailWithLink.send().then(() => {
            resolve();
        }).catch((err) => {
            reject(err);
        });
    });
}

function deleteFile(file) {
    setTimeout(function () {
        fs.unlink(file.projectId + "/" + file.tempFile, function () {
            console.log('Delete file: ' + file.projectId + "/" + file.tempFile + ' Was Deleted');
        });
        deleteFolderRecursive('./tempFiles');
    }, 3600000);
}

function deleteFolderRecursive(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function (file, index) {
            var curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}


module.exports.createDocx = createDocx;
module.exports.dowloadDocx = dowloadDocx;
