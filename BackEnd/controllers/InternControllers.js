import Intern from '../models/InternDatabase.js';
import {transporter} from "../config/emailConfig.js"



export const createIntern = async (req, res) => {
    try {
        const internData = req.body;

        // Validate required fields
        if (!internData.fullName || !internData.email || !internData.mobile) {
            return res.status(400).json({ message: "Full Name, Email and Mobile are required" });
        }

        // Check for existing email or mobile
        const existingEmail = await Intern.findOne({ email: internData.email });
        if (existingEmail) return res.status(400).json({ message: "Intern Application already exists" });

        const existingMobile = await Intern.findOne({ mobile: internData.mobile });
        if (existingMobile) return res.status(400).json({ message: "Intern Application already exists" });

        // Create new intern
        const newIntern = new Intern({
            fullName: internData.fullName,
            email: internData.email,
            mobile: internData.mobile,
            dob: internData.dob,
            gender: internData.gender,
            state: internData.state,
            city: internData.city,
            address: internData.address,
            pinCode: internData.pinCode,
            college: internData.college,
            course: internData.course,
            educationLevel: internData.educationLevel,
            domain: internData.domain,
            contactMethod: internData.contactMethod,
            resumeUrl: internData.resumeUrl,
            duration: internData.duration,
            prevInternship: internData.prevInternship,
            TpoEmail: internData.TpoEmail,
            TpoNumber: internData.TpoNumber,
            TpoName: internData.TpoName,
        });

        await newIntern.save();

        // Email message (same as WhatsApp style)
const emailMsg = `Dear ${newIntern.fullName},

Thank you for your interest in joining Graphura and submitting your application for the ${newIntern.domain} internship position.

📌 Internship Domain: ${newIntern.domain}
📌 Duration: ${newIntern.duration}

We have successfully received your application and our recruitment team will carefully review your qualifications. We appreciate the time and effort you've invested in your application.

You can expect to hear back from us within the next 2-3 business days regarding the status of your application.

Should you have any questions in the meantime, please don't hesitate to reach out.

Best regards,
The Graphura Team
🌐 www.graphura.online`;

        const mailOptions = {
            from: '"Graphura Team" <no-reply@graphura.com>', // replace with your sender email
            to: newIntern.email,
            subject: "Graphura - Internship Application Received",
            text: emailMsg, // plain text email
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({ message: "Intern created successfully", intern: newIntern });

    } catch (error) {
        console.log('Error while creating intern:', error);
        res.status(500).json({ message: "Server Error" });
    }
};




