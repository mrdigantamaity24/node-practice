const nodemailer = require('nodemailer');

const sendEmailsTest = async options => {
    // setup email host
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        }
    });

    // define email configuration
    const mailOption = {
        from: 'Diganta Maity <maitydiganta2017@gmail.com',
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    // send the email to user email
    transporter.sendMail(mailOption);
}

module.exports = sendEmailsTest;