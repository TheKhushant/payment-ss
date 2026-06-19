const cron=require("node-cron");
const Student=require("../models/Student");
const sendWhatsapp=require("../utils/sendWhatsapp");
const { getInstallmentStatus, isPositiveInstallment } = require('../utils/installmentUtils');

// */1 * * * *   → every 1 minute
// 0 * * * *     → every hour
// 0 9 * * *     → every day at 9 AM
// 0 0 * * *     → every day at 12 AM
// 0 9 * * 1     → every Monday at 9 AM


// cron.schedule("*/1 * * * *", async()=>{
    cron.schedule("0 9 * * *", async()=>{

    try{

        console.log("Checking overdue students");

        const now=new Date();

        const students=await Student.find({
            installments: {
                $exists: true,
                $ne: []
            }
        });

        for(const student of students){

            let updated=false;

            for(const installment of student.installments){

                if(
                    isPositiveInstallment(installment) &&
                    getInstallmentStatus(installment) === "overdue" &&
                    !installment.whatsappSent
                ){

                    installment.status="overdue";

                    if(!installment.whatsappSent){

                        await sendWhatsapp(
                            process.env.ADMIN_PHONE,
                            `
Student: ${student.name}

Mobile: ${student.mobile}

Installment Amount: ₹${installment.amount}

Due Date:
${installment.dueDate.toDateString()}

Status: OVERDUE
                            `
                        );

                        installment.whatsappSent=true;

                    }

                    updated=true;

                }

            }

            if(updated){
                await student.save();
            }

        }

    }
    catch(error){

        console.log(error);

    }

});