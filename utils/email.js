const nodemailer = require('nodemailer');

const sendEmailsTest = async options => {
    // setup email host
    // const transporter = nodemailer.createTransport({
    //     host: process.env.EMAIL_HOST,
    //     port: process.env.EMAIL_PORT,
    //     auth: {
    //         user: process.env.EMAIL_USERNAME,
    //         pass: process.env.EMAIL_PASSWORD,
    //     }
    // });

    var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "8c32812ca7eee8",
            pass: "********c443"
        }
    });

    // define email configuration
    const mailOption = {
        from: 'Diganta Maity <test@gmail.com',
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    // send the email to user email
    transport.sendMail(mailOption);
}

module.exports = sendEmailsTest;