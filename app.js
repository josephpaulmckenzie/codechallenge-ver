const serverless = require('serverless-http');
const express = require('express');
const app = express();
var https = require("https");
var request = require("request");
var fs = require('fs');
var AWS = require('aws-sdk')
var s3 = new AWS.S3()
require('dotenv').config()
app.use(express.json());

app.post('/', function (req, res) {

    var jsonBody = req.body.toString('utf8')
    var bodyParsed = JSON.parse(jsonBody)
    console.log(bodyParsed)
    var apiKey = bodyParsed["api-key"]

    fs.writeFileSync('/tmp/transcoded.json', bodyParsed);
    if (fs.existsSync("/tmp/transcoded.json")) {
        console.log(":)")
    } else {
        console.log(":(")

    }

    var options = {
        method: 'POST',
        url: process.env.theapiurl,
        headers: {
            'content-type': 'application/json',
            'x-api-key': `${apiKey}`
        },
        body: bodyParsed,
        json: true
    };

    request(options, function (error, response, body) {
        if (response.statusCode != 200) {
            res.status(response.statusCode).json({
                "error": error
            });
        } else {
            res.status(200).json(body);
        }
        fs.writeFileSync('/tmp/results.json', body);
        if (fs.existsSync("/tmp/results.json")) {
            console.log(":)")
        } else {
            console.log(":(")

        }


});


// Uncomment for Local
// app.listen(3000, () => console.log(`listening on port 3000!`));

// Comment out for Local
module.exports.handler = serverless(app);