const nodeMailer = require('nodemailer');

// Options is an object with email, subject, and a message
const SendEmail = async (options) => {
    // Create transporter
    const transporter = nodeMailer.createTransport({
        service: "gmail",
        auth: {
            user: "Bsf2000929@ue.edu.pk",
            pass: "dr45pybpq",
        }
    });

    // Mail options
    const mailOptions = {
        from: "Bsf2000929@ue.edu.pk",
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    try {
        // Send email
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        throw error; // Re-throw the error to propagate it further
    }
};

module.exports = SendEmail;
