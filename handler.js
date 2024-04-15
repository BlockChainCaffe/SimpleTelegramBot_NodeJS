const express = require("express")
const router = express.Router()
const config    = require('./config')
const axios = require('axios')

/******************************************************************************
 * 
 *  Perform some security / filtering checks on the incoming message
 *  Need to:
 *  - have the security token set (if defined)
 *  - belong to a known chat (if defined)
 *  - come from a know user (if defined)
 * 
 ******************************************************************************/

async function securityChecks( req, res, next) {
    // Check that the message comes from Telegram
    // by checking the shared secret header
    if (config.secret_whtoken) {
        if (! req.headers['x-telegram-bot-api-secret-token'] ||
            req.headers['x-telegram-bot-api-secret-token'] !== config.secret_whtoken
        ) {
            // Stop execution 
            console.error("Missing secret token !!")
            return
        }
    }

    // Check if the chat is recognezed as valid
    if (config.allowed_chats && config.allowed_chats.length > 0) {
        const chatId = req.body.message.chat.id || req.body.channel_post.chat.id
        if (! config.allowed_chats.includes(chatId)) {
            // Stop execution 
            console.error("Chat "+chatId+" not allowed")     
            return
        }
    }

    // Check if user is recognized as valid
    if (config.allowed_users && config.allowed_users.length > 0 || req.body.message.chat) {
        const username = req.body.message.chat.username || ''
        if (! config.allowed_users.includes(username)) {
            // Stop execution 
            console.error("User "+username+" not allowed")     
            return
        }
    }

    // Something went wrong: DO NOT pass message onwards
    next()
    return
}


/******************************************************************************
 * 
 *  BASIC Respond function
 * 
 ******************************************************************************/

async function respond(chat_id, message) {
    try {
        let res = await axios.post(config.telegram_api+'/sendMessage', {
            chat_id: chat_id,
            text: message
        })
    } catch (e) {
        console.error(e)
    }
}


/******************************************************************************
 * 
 *  BASIC POST & GET INCOMING ROUTES
 * 
 ******************************************************************************/

/**
 * Get
 */
router.get('*', async (req, res) => {
    console.log("Got new incoming get request")
    res.send("Bot Up and accepting get requests")
})


/**
 * Post
 */
router.post('*', securityChecks, async (req, res) => {
    console.log("Got new incoming post request")
    console.log(req.body)

    // Direct user message ??
    if ('message' in req.body) {
        const chatId = req.body.message.chat.id
        const text = req.body.message.text
        // Just echo back
        await respond(chatId,text)
        return res.send()
    }

    // Channel message ??
    if ('channel_post' in req.body) {
        const chatId = req.body.channel_post.chat.id
        const text = req.body.channel_post.text
        // Just echo back
        await respond(chatId,text)
        return res.send()
    }
})


/******************************************************************************
 * 
 * MODULE EXPORTS
 * 
 ******************************************************************************/

module.exports = router;