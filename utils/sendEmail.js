const nodemailer = require("nodemailer");

async function sendEmailVerification(to, url, subject) {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'inzamamulhaquesobuz655@gmail.com',
                pass: 'myPass',
            },
        });

        const result = await transporter.sendMail({
            from: 'no-reply@ecoSynch.com',
            to: to,
            subject: 'change password for EcoSynch',
            text: `Welcome to EcoSync! ${subject} Please click the following link to proceed: ${url}.`,
            html: `Welcome to EcoSync! ${subject} Please click the following link to proceed: <a href="${url}">${url}</a>`,
        });

        console.log("Email sent successfully");
        return result;
    } catch (error) {
        console.log("Email not sent!");
        console.log(error);
        return { error: error.message };
    }
}

module.exports = sendEmailVerification;
