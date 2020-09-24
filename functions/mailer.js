// nodemailer = require("nodemailer")
require("dotenv").config(); // add variables in .env file to process.env
// NOTE - .env file has to be local to this file

// send email based on sender web name and environment variable setup 
exports.handler = async (event) => {

  if(!process.env.CONTACT_DATA) {
    throw new Error("No CONTACT_DATA supplied in .env file");
  }
  // '["website": "cmcsacramento.com","title": "Hello from cmc Sacramento","to": ["johnlobster@comcast.net"]]'
  // [{"website":"cmcsacramento.com","title":"Hello from cmc Sacramento","to":["johnlobster@comcast.net","email2"]}]
  // const tmp = [ 
  //   {
  //     website: "cmcsacramento.com",
  //     title: "Hello from cmc Sacramento",
  //     to: [
  //       "johnlobster@comcast.net",
  //       "email2",
  //     ]
  //   }
  // ]

  // console.log(tmp)
  // console.log(JSON.stringify(tmp))

  const contactData = JSON.parse(process.env.CONTACT_DATA)

  if (!process.env.EMAIL_ADDRESS) { 
    throw new Error("No destination Email was set up"); 
  }  
  // Check that all environment variables to access the mail server are present
  if ( 
    ! process.env.NODEMAILER_HOST ||
    ! process.env.NODEMAILER_PORT ||
    ! process.env.NODEMAILER_SECURE ||
    ! process.env.NODEMAILER_AUTH_USERNAME ||
    ! process.env.NODEMAILER_AUTH_PASSWORD) {
    throw new Error("Missing environment variable required to access mail server");
  }
  // set up nodemailer
  // let transporter = nodemailer.createTransport({
  //   host: process.env.NODEMAILER_HOST,
  //   port: process.env.NODEMAILER_PORT,
  //   secure: process.env.NODEMAILER_SECURE,
  //   auth: {
  //     user: process.env.NODEMAILER_AUTH_USERNAME,
  //     pass: process.env.NODEMAILER_AUTH_PASSWORD
  //   }
  // });
  
  
  // let transporter = nodemailer.createTransport({
  //   host: 'smtp.gmail.com',
  //   port: 465,
  //   secure: true,
  //   auth: {
  //     type: 'OAuth2',
  //     user: process.env.MAIL_LOGIN,
  //     clientId: process.env.CLIENT_ID,
  //     clientSecret: process.env.CLIENT_SECRET,
  //     refreshToken: process.env.REFRESH_TOKEN,
  //     accessToken: process.env.ACCESS_TOKEN
  //   }
  // });

  /////////////////////////////////////////////////////////////////
  // Debug

  console.log("Contact data")
  console.log(process.env.CONTACT_DATA)
  console.log(contactData)
  console.log('-----------------------------------------')
  // console.log(event.body);

  // transporter.sendMail({
  //   from: "suspicious@dodgy.com",
  //   to: process.env.EMAIL_ADDRESS,
  //   subject: "Your web page would like to talk to you",
  //   text: mailString,
  // }, (err, info) => {
  //   if (err) {
  //     res.json({ contributeReturn: "Contribution failed" });
  //     console.log("Mail failed to send");
  //     console.log(err);
  //   } else {
  //     res.json({ contributeReturn: "Success" });
  //   }
  // }
  //);
  // transporter.sendMail({
  //   from: process.env.MAIL_LOGIN,
  //   to: process.env.MAIL_TO,
  //   subject: process.env.SUBJECT + new Date().toLocaleString(),
  //   text: event.body
  // }, function (error, info) {
  //   if (error) {
  //     callback(error);
  //   } else {
  //     callback(null, {
  //       statusCode: 200,
  //       body: "Ok"
  //     });
  //   }
  // });

  console.log("Return")
  return {
    statusCode: 200,
    body: `mailer.js completed`,
  }
}