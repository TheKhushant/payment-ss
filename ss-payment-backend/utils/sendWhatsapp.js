const twilio = require("twilio");

const client = twilio(
    process.env.TWILIO_SID,
    process.env.TWILIO_AUTH_TOKEN
);

const sendWhatsapp = async(number,message)=>{

    try{

        await client.messages.create({
            body: message,
            from:"whatsapp:+14155238886",
            to:`whatsapp:${number}`
        });

        console.log("Whatsapp sent");

    }
    catch(error){

        console.log(error.message);

    }

}

module.exports=sendWhatsapp;