import ElasticMail from 'nodelastic';
import fs from 'fs';
import path from 'path';

const apiKey = 'D5401758F52C814DA5666737DBAEA792160631A1C6B178AA747F39AD01E20E280292503715805CD662CF4DA578EE6E83';

var client = new ElasticMail(apiKey);

// console.log(__dirname);
// let invitation = fs.readFileSync(path.resolve("./server/resources/invitation.png"), "utf-8");
// console.log(invitation);

const sendEmail = async ({ fromEmail, fromName, toEmail, ccEmail, subject, body, attachments }) => {
    // var attachments = [
    //   // PDF
    //   { data: fs.readFileSync("filepath_here"), filename: "attachment2.pdf", contentType: "application/pdf" },
    // ];
    // 'no-reply@sky-oasis.ecopark.zii.vn'

    const res = await client.send(
        {
            from: fromEmail,
            fromName: fromName,
            subject: subject,
            msgTo: [toEmail],
            msgCC: [ccEmail],
            bodyHtml: body,
        },
        attachments
    );

    // console.log(res);

    return res;
};

export { sendEmail };
