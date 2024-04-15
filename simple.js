// Global configuration
const config = require("./config")

// Basic Dependecties
const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express')
const axios = require('axios')

/******************************************************************************
    App setup
******************************************************************************/

const app = express()
app.use(express.json())

// pass message handling to dedicated file
const message_handler = require("./handler.js")
app.use('/'+config.server_path, message_handler)

// Return a generic 500 if no other return code si already set
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

/******************************************************************************
    Start Server
******************************************************************************/
async function set_webhook() {
    // See https://core.telegram.org/bots/webhooks
    // Only use ports 80, 443, 88, 8443
    let there = config.telegram_api+'/setWebhook?url='+config.webhook
    if (config.secret_whtoken !== '') {
        there += "&secret_token="+config.secret_whtoken
    }

    try{
        const res = await axios.get(there)
        console.log(res.data)
    } catch (e) {
        console.error(e.message)
    }
}

let server
if (fs.existsSync('./SSL/privkey.pem') && config.server_proto === 'https') {
    // Get SSL Certificate
    const privateKey = fs.readFileSync('./SSL/privkey.pem', 'utf8')
    const certificate = fs.readFileSync('./SSL/cert.pem', 'utf8')
    const ca = fs.readFileSync('./SSL/chain.pem', 'utf8')
    // Get Credentials for server
    const credentials = {
        key: privateKey,
        cert: certificate,
        ca: ca
    }
    // Start a development HTTPS server.
    server = https.createServer(credentials,app)
} else {
    // Start an http server
    server = http.createServer(app)
}

server.listen( config.server_port, () => {
    console.log("Server 🚀 started on protocol "+config.server_proto+" and port "+config.server_port+"...")
    console.log("Test by browsing "+config.webhook)
    console.log("Accepting messages from: "+config.allowed_chats)
    console.log("Accepting messages from: "+config.allowed_users)

})

set_webhook()