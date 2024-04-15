const dotenv = require('dotenv');

dotenv.config()
// const envs = ['Telegram.env']
// for (let envf of envs) {
//     let loadenv = dotenv.config({ path: envf})    
//     if (loadenv.error) {
//         console.error("Could not load .env file(s)")
//         console.error(loadenv.error)
//         process.exit()
//     }    
// }

// Telegram bot & Channel
const telegram_bot_token    = process.env.TELEGRAM_BOT_TOKEN
const server_proto          = process.env.SERVER_PROTO
const server_url            = process.env.SERVER_URL
const server_port           = process.env.SERVER_PORT
const server_path           = process.env.SERVER_PATH

if (![80, 443, 88, 8443].includes(parseInt(server_port))) {
    console.error("Cannot use that port for webhooks")
    process.exit()
}

// Secret token to authenticate webhook incoming calls
const secret_whtoken        = process.env.SECRET_TOKEN

// Webhook callbak url
const webhook               = server_proto+'://'+server_url+':'+server_port+'/'+server_path

// Telegram API Endpoint
const telegram_api          = 'https://api.telegram.org/bot'+telegram_bot_token


const allowed_chats         = process.env.ALLOWED_CHATID.split().map(x=>parseInt(x))
const allowed_users         = process.env.ALLOWED_USERS.split()

/* ------------------------------------------------------------------
    MODULE EXPORTS
-------------------------------------------------------------------*/

module.exports = {
    telegram_bot_token,

    server_proto,
    server_url,
    server_port,
    server_path,

    secret_whtoken,
    allowed_chats,
    allowed_users,

    webhook,
    telegram_api
}
