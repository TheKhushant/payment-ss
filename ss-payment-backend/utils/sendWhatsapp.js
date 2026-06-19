const twilio = require("twilio");

const client = process.env.TWILIO_SID && process.env.TWILIO_AUTH_TOKEN
    ? twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN)
    : null;

const sendWhatsapp = async (number, message) => {
    if (!client || !number || !message) {
        console.log("Whatsapp skipped: missing client credentials or message payload");
        return;
    }

    try {
        await client.messages.create({
            body: message,
            from: "whatsapp:+14155238886",
            to: `whatsapp:${number}`
        });

        console.log("Whatsapp sent");
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = sendWhatsapp;