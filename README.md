# mailLambda

John Webster

(AWS lambda) function to be deployed on Netlify that will accept information from a website and forward as email using nodemailer

Hides email addresses from web page

### Environment setup

The .env file contains setup information

```bash
EMAIL_ADDRESS=""
NODEMAILER_HOST=""
NODEMAILER_PORT=
NODEMAILER_SECURE=true
NODEMAILER_AUTH_USERNAME=""
NODEMAILER_AUTH_PASSWORD=""
CONTACT_DATA=""
```

`CONTACT_DATA` is a JSON string for the following kind of object
```
[
  webid1: [
    email1,
    email2
  ]
]
```

### Testing

Local testing with Postman

Testing is not that hard, configuration is a major pain. `netlify-lambda` gets you started quickly, but very hard to debug

Local debug using
```
node --trace-warnings mailer.node.test.js
```

node incompatibility with js modules is very frustrating
Tried to use Jest

When deployed on Netlify, test with Postman
URL
```
https://nifty-babbage-7c7caa.netlify.app/.netlify/functions/mailer.js
```


### Dev setup

#### Add repo to netlify in github

Netlify interface is probably easier

Profile -> settings -> applications -> Netlify -> configure -> Repository access


## Cheatsheet stuff

Immediately-invoked Function Expression : IIFE
`async` because that's an important use case

```
(async () => {
  /* */
})()
```

Pretty print object
```
Stringify(object, null, 2)
```

iterate over array

await in loop - use for()

forEach
```
array.forEach((item, index) => {

}); 

```

iterate over an object
```
for (const key of Object.keys(myObject)) {

}

for (const [key, item] of Object.entries(body)) {


}
```

arithmetic on Date() using .valueOf()
```
const runTime = new Date(exitTime.valueOf() - entryTime.valueOf())
console.log(runTime.getSeconds())
```

