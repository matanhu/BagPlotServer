var officegen = require('officegen');
var fs = require('fs');
var request = require('request');
var projectsFactory = require('./projectsFactory');
var customersFactory = require('./customersFactory');
var contactFactory = require('./contactFactory');
var emailFactory = require('./emailFactory');

function createDocx(projectReq, callback) {
    var projectRes = null;
    var contactsRes = null;
    var customerRes = null;
    projectsFactory.getProjectById(projectReq, function(dbProjectRes) {
        projectRes = dbProjectRes;
        customersFactory.getCustomersById(projectRes[0].customer_id, function(dbCustomerRes){
            customerRes = dbCustomerRes.customers;
            contactFactory.getContacsByProjectId(projectRes[0].customer_id, function(dbContactRes) {
                contactsRes = dbContactRes;
                generateDocxFile(projectRes, customerRes, contactsRes, function(docx) {
                    callback(docx);
                });
            });
        });
    });
}

function generateDocxFile(projectRes, customerRes, contactsRes, callback) {
    var docx = officegen ({
        'type': 'docx', // or 'xlsx', etc
        'onend': function ( written ) {
            console.log ( 'Finish to create a PowerPoint file.\nTotal bytes created: ' + written + '\n' );
        },
        'onerr': function ( err ) {
            console.log ( err );
        },
        'subject': projectRes[0].project_name,
        'description': projectRes[0].description
    });

    addProjectToDocs(projectRes, docx, function(docxWithProject) {
        addContactToDocx(contactsRes, docx, function(docxWithContacts) {
            var out = fs.createWriteStream ( 'out.docx' );
            docx.generate ( out);
            out.on ( 'close', function () {
                sendEmail();
            });
        });
    });
    
}

function addProjectToDocs(project, docx, callback) {
    var pObjName = docx.createP ();
    pObjName.options.align = 'center'; // Also 'right' or 'jestify'
    pObjName.addText ( project[0].project_name, { bold: true, underline: true } );
    
    var pObjDes = docx.createP ();
    pObjDes.options.align = 'right'; // Also 'right' or 'jestify'
    pObjDes.addText ( project[0].description );
    pObjDes.addLineBreak ();

    var pObjImage = docx.createP();
    // pObjImage.addImage ( path.resolve(__dirname, 'myFile.png' ) );
    download(project[0].image, 'google.png', function(){
        console.log('done');
        pObjImage.addImage ( fs.readFileSync('google.png') );
        pObjDes.addLineBreak ();
        callback(docx);
      });
    //   callback(docx);
    //   return docx;
}

function addContactToDocx(contactsList, docx, callback) {
    for(var i = 0 ; i < contactsList.length ; i++) {
        var pObj = docx.createP ();
        pObj.options.align = 'right'; // Also 'right' or 'jestify'
        pObj.addText ( 'שם פרטי:', { bold: true, underline: true } );
        pObj.addText ( contactsList[i].firstName );
        pObj.addLineBreak ();
        pObj.addText ( 'שם משפחה:', { bold: true, underline: true } );
        pObj.addText ( contactsList[i].lastName );
        pObj.addLineBreak ();
        pObj.addText ( 'טלפון במשרד:', { bold: true, underline: true } );
        pObj.addText ( contactsList[i].phoneOffice );
        pObj.addLineBreak ();
        pObj.addText ( 'פקס:', { bold: true, underline: true } );
        pObj.addText ( contactsList[i].faxNumber );
        pObj.addLineBreak ();
        pObj.addText ( 'סלולאר:', { bold: true, underline: true } );
        pObj.addText ( contactsList[i].cellular );
        pObj.addLineBreak ();
        pObj.addText ( 'דוא"ל:', { bold: true, underline: true } );
        pObj.addText ( contactsList[i].email );
        pObj.addLineBreak ();
        pObj.addLineBreak ();
    }
    // return docx;
    callback(docx);
}

var download = function(uri, filename, callback){
    request.head(uri, function(err, res, body){
        console.log('content-type:', res.headers['content-type']);
        console.log('content-length:', res.headers['content-length']);

        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};
  

function sendEmail() {
    var email = new emailFactory('out.docx');
    email.send();
}

module.exports.createDocx = createDocx;