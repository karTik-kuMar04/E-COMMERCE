import nodemailer from 'nodemailer';
import { env } from '../../config/index.js';
import logger from '../../utils/logger.js';

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: env.ADMIN_EMAIL,
        pass: env.EMAIL_PASS
    }
});

const reportBug = async (req, res) => {
    const { message } = req.body;

    if(!message) {
        returnres.status(400).json({ error: "Message is required"});
    };

    try {
        const mailOptions = {
            from: `"InkVerse Beta" <${env.ADMIN_EMAIL}>`, // by myself
            to: env.ADMIN_EMAIL, // Send to yourself
            subject: `🐛 New Bug Report: InkVerse`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #4F46E5;">New Bug Report Received</h2>
                <p style="color: #555;">A user just submitted a bug report from the Hero section.</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                
                <h3 style="margin-bottom: 5px;">Description:</h3>
                <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; color: #374151;">
                    ${message}
                </div>

                <p style="font-size: 12px; color: #999; margin-top: 30px;">
                    Sent from InkVerse Backend • ${new Date().toLocaleString()}
                </p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ success: true, message: "Report Sent Successfully"})
    } catch (err) {
        logger.error("Email Error: ", err);
        return res.status(500).json({ success: false, error: "failed to send report to admin"})
    }
}

export {reportBug}