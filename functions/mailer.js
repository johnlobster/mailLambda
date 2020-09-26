// require("dotenv").config(); // add variables in .env file to process.env

import dotenv from 'dotenv'
import nodemailer from "nodemailer"

dotenv.config() // Note, potential bug if nodemailer needed environment variables set up

// send email based on web url of sender and environment variable setup 

// Format of CONTACT_DATA
  // '["website": "cmcsacramento.com","title": "Hello from cmc Sacramento","to": ["johnlobster@comcast.net"]]'
  // [{"website":"cmcsacramento.com","title":"Hello from cmc Sacramento","to":["johnlobster@comcast.net","email2"]}]
  // const tmp = [ 
  //   {
  //     website: "cmcsacramento.com",              // check that there was an https post request from website:
  //     title: "Hello from cmc Sacramento",        // String to use as Subject: on email sent
  //     to: [                                      // list of email destinations to send emails to (strings)
  //       "johnlobster@comcast.net",
  //       "email2",
  //     ]
  //   }
  // ]
  // Body of posted message can be
  //  - JSON object. Parsed and pretty printed as message. Invalid JSON treated as plain text
  //  - plain text
  //
  //  HTML will be treated as plain text
  //
  // Message in email will consist of
/*
  Contact from ${website} received ${date}

  JSON printout or plain text

  Sent by "mailer.js"
*/

/* event object supplied by Netlify
{
    "path": "Path parameter",
    "httpMethod": "Incoming request's method name"
    "headers": {Incoming request headers}
    "queryStringParameters": {query string parameters }
    "body": "A JSON string of the request payload."
    "isBase64Encoded": "A boolean flag to indicate if the applicable request payload is Base64-encode"
}
*/

// pretty print body object
const ppBody = (body) => {
  let outputString = ""
  if (typeof (body) === "string") {
    outputString = body
  } else if  (typeof (body) === "number") {
    outputString = toString(body)
  } else {
    for (const [key, item] of Object.entries(body)) {
      outputString = `${outputString}
      ${key}
          ${ppBody(item)}
      ` 
    }
  }
  return outputString
}

//////////////////////////////////////////////////////////////////////////////////////////////////////
// Main

export async function handler(event) {

  

  const entryTime = new Date()
  console.log(`Handler called by website ${event.headers.host} ${entryTime}`)
  // check all environment variables
  if (
    !process.env.EMAIL_ADDRESS ||
    !process.env.NODEMAILER_HOST ||
    !process.env.NODEMAILER_PORT ||
    !process.env.NODEMAILER_SECURE ||
    !process.env.NODEMAILER_AUTH_USERNAME ||
    !process.env.NODEMAILER_AUTH_PASSWORD
    ) {
    console.log("Missing environment variable required to access mail server")
    return {
      statusCode: 400,
      body: `Error: Missing environment variable required to access mail server`,
    }
  }
  if (!process.env.CONTACT_DATA) {
    console.log("No CONTACT_DATA supplied in .env file");
    return {
      statusCode: 400,
      body: `Error: No CONTACT_DATA supplied in .env file`,
    }
  }
  let contactData;
  try {
    contactData = JSON.parse(process.env.CONTACT_DATA)
  }
  catch (err) {
    console.log("CONTACT_DATA was invalid JSON")
    console.log(process.env.CONTACT_DATA)
    console.log(err)
    return {
      statusCode: 400,
      body: `Error: CONTACT_DATA was invalid JSON`,
    }
  }

  if ( event.httpMethod !== "https") {
    console.log(`function called by ${event.headers.host} was not https ( ${event.httpMethod})`)
    console.log(`Message body\n${event.body}`)
    return {
      statusCode: 400,
      body: `Error: function called by ${event.headers.host} was not https ( ${event.httpMethod})`,
    }
  }
  // identify calling website 
  let websiteIndex = -1 // index into CONTACT_DATA array
  for ( let i = 0 ; i < contactData.length ; i++) {
    // console.log(`---> ${i}  ${contactData[i].website} `)
    if ( event.headers.host  === contactData[i].website ) {
      websiteIndex = i
    }
  }
  if ( websiteIndex === -1 ) {
    console.log(`Error: function called by ${event.headers.host} - no corresponding CONTACT_DATA entry`)
    console.log(`Message body\n${event.body}`)
    return {
      statusCode: 400,
      body: `Error: function called by ${event.headers.host} - host not recognized`,
    }
  }
  
  /////////////////////////////////////////////////////////////////
  // Debug

  // console.log('Debug -----------------------------------')
  // console.log("Contact data")
  // console.log(process.env.CONTACT_DATA)
  // console.log(contactData)
  // console.log(`website index ${websiteIndex}`)
  // console.log('-----------------------------------------')
  // console.log(event);
  // console.log('-----------------------------------------')
  // console.log('Transporter')
  // console.log(transporter)

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // set up nodemailer
  let transporter = nodemailer.createTransport({
    host: process.env.NODEMAILER_HOST,
    port: process.env.NODEMAILER_PORT,
    secure: process.env.NODEMAILER_SECURE,
    auth: {
      user: process.env.NODEMAILER_AUTH_USERNAME,
      pass: process.env.NODEMAILER_AUTH_PASSWORD
    }
  });

  try {
    let tVerify = await transporter.verify() 
  }
  catch (err) {
    console.log("Mail server validation error")
    console.log(`Message body\n${event.body}`)
    console.log(err)
    return {
      statusCode: 400,
      body: `Error: Mail server validation error`,
    }
  }
    
  
  //////////////////////////////////////////////////////////////////////////////////
  // Send email to list

  /* NOTE
    since I last set this up, comcast changed something
    Now the from field needs to be set to your user Id
  */

  let messageBody = ""
  try {
    const mess = JSON.parse(event.body)
    messageBody = ppBody(mess)
  } 
  catch (err){
    messageBody = event.body
    // console.log("Not JSON")
    // console.log(err)
  }
  // console.log("Message body")
  // console.log(messageBody)
  const mailMessage = `
  A website contact from ${event.headers.host} was received ${entryTime.toDateString()}

  ${messageBody}

  Sent by "mailer.js" from ${event.path} ${entryTime.getHours()}:${entryTime.getMinutes()}:${entryTime.getSeconds()}
  `

  for ( let i = 0; i < contactData[websiteIndex].to.length; i++ ) {
    try {
      console.log(`Sending mail message ${i + 1} to ${contactData[websiteIndex].to[i]}`)
      const info = await transporter.sendMail({
        from: process.env.EMAIL_ADDRESS,
        to: contactData[websiteIndex].to[i],
        subject: contactData[websiteIndex].title,
        text: mailMessage,
      });
    }
    catch (err) {
      console.log("Send mail error")
      console.log(`Message body\n${event.body}`)
      console.log(err)
      return {
        statusCode: 400,
        body: `Error: Mail server send error`,
      }
    }
  }
  
  const exitTime = new Date() 
  // const runTime = exitTime.getSeconds() - entryTime.getSeconds()
  const runTime = new Date(exitTime.valueOf() - entryTime.valueOf())

  console.log(`Function completed at ${exitTime}`)
  console.log(`Function took ${runTime.getSeconds()} seconds to run. Started ${exitTime}\n\n`)
  return {
    statusCode: 200,
    body: `mailer.js completed in ${runTime.getSeconds()} seconds`,
  }
}