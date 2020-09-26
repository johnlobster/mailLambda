import {handler} from './mailer.js'


// "path": "Path parameter",
//   "httpMethod": "Incoming request's method name"
// "headers": { Incoming request headers }
// "queryStringParameters": { query string parameters }
// "body": "A JSON string of the request payload."
// "isBase64Encoded": "A boolean flag to indicate if the applicable request payload is Base64-encode"



// console.log("TESTER body")
// console.log(event2.body)
// const temp = JSON.parse(event2.body, null, 2) 
// console.log(temp)
// console.log("TESTER run event2")

(async () => {
  // Whole test in IIFE
  console.log("Start of mailer test")

  // simple body
  const event1 = {
    path: "localhost:9000",
    httpMethod: "POST",
    headers: {
      host: "localhost:9000"
    },
    body: "A cool, meaningful message"
  }

  // body is JSON string
  const event2 = {
    path: "localhost:9000",
    httpMethod: "POST",
    headers: {
      host: "localhost:9000"
    },
    body: '{"title":"Hello","subject":"Goodbye","body":"Relevant stuff"}'
  }

  // unrecognized host
  const event3 = {
    path: "bad.com",
    httpMethod: "POST",
    headers: {
      host: "bad.com"
    },
    body: '{"title":"Hello","subject":"Goodbye","body":"Relevant stuff"}'
  }

  try{
    const returnValue = await handler(event1)
    console.log("Return value from handler(event1)")
    console.log(returnValue)
  }
  catch (err){
    console.log("Oh dear, something went wrong in mailer.node.test event1")
    console.log(err)
  }
  finally {
    try {
      const returnValue = await handler(event2)
      console.log("Return value from handler(event2)")
      console.log(returnValue)
    }
    catch (err) {
      console.log("Oh dear, something went wrong in mailer.node.test event2")
      console.log(err)
    }
    finally {
      try {
        const returnValue = await handler(event3)
        console.log("Return value from handler(event3)")
        console.log(returnValue)
      }
      catch (err) {
        console.log("Oh dear, something went wrong in mailer.node.test event3")
        console.log(err)
      }
      finally {
        console.log("End of test")
      }
    }
  }

  
  

})()
