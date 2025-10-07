import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const fromWhatsappNumber = "whatsapp:+14155238886";

async function sendWhatsApp(toNumber, message) {
  try {
    const response = await client.messages.create({
      body: message,
      from: fromWhatsappNumber,
      to: `whatsapp:+91${toNumber}`,    
    });
    return response;
  } catch (err) {
    throw err;
  }
}

export default sendWhatsApp;
