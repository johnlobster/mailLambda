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

