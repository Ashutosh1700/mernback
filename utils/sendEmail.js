const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
    
        
    const transporter = nodemailer.createTransport({
        service: process.env.SMTP_SERVICE,
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,

        secure: false,
        // secure: false,
        auth: {
            user: process.env.SMTP_MAIL,      // sender email address
            pass: process.env.SMTP_PASSWORD,   // app password from email account
        },
    });

    const mailOptions = {
        from: {
            name: process.env.SMTP_NAME,
            address: process.env.SMTP_MAIL,
        }, //sender address
        to: options.email, // list of receivers for more [ use this] or "," write email
        subject: options.subject, // Subject line
        text: options.message, // plain text body
       
    }


    const sendMail = async (transporter, mailOptions) => {
        try {
            await transporter.sendMail(mailOptions);
            console.log("send mail successfully");

        }
        catch (error) {
            console.error(error);

        }
    }

    sendMail(transporter, mailOptions);
    };

module.exports = sendEmail;