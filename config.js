const nodeMailer = require('nodemailer');
const index = require('./index');

var transporter = nodeMailer.createTransport({
    service : 'gmail',
    secure: true,
    auth : {
        
        user : "", // desired email goes here
        pass : "" // password goes here
    },
    attachments: [
        {
            filename: 'Imp_File',
            content: './uploads/'+index.file
        }
    ]
});

var mailOptions = {
        from: '', // from as described
        to : index.to, // to goes here which comes from user
        subject: 'This is sample pdf doc Test'
}

module.exports = {
    transporter, mailOptions
}
