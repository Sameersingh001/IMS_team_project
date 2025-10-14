import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com", // Brevo SMTP relay
  port: 587,                     // Use 587 for TLS
  secure: false,       // false for port 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.BREVO_API_KEY, // Gmail App Password
  },
});
