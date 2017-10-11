var nodemailer = require('nodemailer');
var fs = require('fs');
var path = require('path');

function Emailer(etachment) {
    this.smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'matan.chipopo@gmail.com',
        pass: '01111987'
    }
    });

    this.mailOptions = {
        from: 'matan.chipopo@gmail.com',
        to: 'matanhuja@gmail.com',
        subject: 'Sending Email using Node.js',
        text: 'That was easy!',
        attachments:[{
                filename: 'out.docx',
                // content: require('hyperzip').request(path.join(__dirname, '../out.docx')),
                filePath: require("fs").readFileSync('out.docx'),
                content:  new Buffer(require("fs").readFileSync('out.docx')),
                contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        },{
            filename: 'google.png',
            // content:'google.png',
            filePath: require("fs").readFileSync('google.png'),
            content: new Buffer(require("fs").readFileSync('google.png')),            
            // contentType: 'image/png'
    }]
    };

    this.send = function() {
        this.smtpTransport.sendMail(this.mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
        });
    }
}

module.exports = Emailer;