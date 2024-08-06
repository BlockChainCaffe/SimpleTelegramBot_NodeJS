# Simple telegram bot in NodeJS

This is a simple, almost empty, telegram bot in NodeJS.
It uses plain express+axios to handle the Telegram bot API.

This assumes that you can run this code on a public server with
a public IP or proper DNS resolution. If not try using [Traefik](https://traefik.io/traefik), [NGrok](https://ngrok.com/) or similar reverse proxy

You might also need to set up https, so you might want to look at [Let's encrypt](https://letsencrypt.org/)

## Getting a bot API key from telegram
Mandatory steps:
- Connect with the bot `@botfather`
- create a `/newbot`
- give him a `name` and an `account name` (must end with _bot)
- copy the **bot api token**

Optional steps (you might do this later):
- change bot profile picture with `/setuserpic`
- change privacy setting with `/setprivacy` (to receive all messages)
- set bot commands in @botfather with `/setbotcommands`

## Tests and Raw usage:
You might not need to use a full bot, for example if you just need to use the bot as a broacaster for messages in a channel or group.
In those cases all you need is the `chat-id`

To get the `chat-id`:
- create the group or channel
- add the bot to group or channel
- make sure bot is **admin**
- send a message in the group/channel
- go to this url:
  ```
  https://api.telegram.org/bot<YourBOTToken>/getUpdates
  ```
- grab the JSON of the message the bot received and extract the value of `chat-id` from there  

## Install Project
- clone project on server
- run `npm install`
- copy `_env_sample` file as `.env`
- edit `.env` file as described below

## Cofiguration

Here the parameters of the `.env` file

Mandatory parameters:

-  TELEGRAM_BOT_TOKEN : Bot API token received form @BotFather
-  SERVER_PROTO : `http` or `https`, if https see later where to put certificates
-  SERVER_URL : the public IP/url of your server your bot will run on. It will receive incoming messages here.
-  SERVER_PORT : the port the script will be listening to (443, 80, 88, 8443)
-  SERVER_PATH : the path (you might leave it like that)

Optional parameters:
-  SECRET_TOKEN : a token used as shared secret between bot and telegram to autenticate incoming messages

To be implemented for security:
- ALLOWED_CHATID : a space separated list of recognized `chat ids`
- ALLOWED_USERS : a space separated list of `users` the bot will recognize

### Configuring HTTPS
Get certificates via certbot/letsencrypt and put all cert & key files in the SSL folder of the project
You need `privkey.pem`, `cert.pem` , `chain.pem` files
Remeber to keep them updated every month or so

## Running

You can use nodemon to start the BOT.

Upon start it will instruct Telegram to use webhooks to send incoming messages. If successful the following lines will be prompted

```
Server 🚀 started on protocol https and port XXXX...
Test by browsing https://your.domain.com:XXXX/webhook
```
Point your browser to the indicated url. If all is fine log messages should appear both in the browser and in the console

## Important notes
- webhooks only work if destination port is
    - 443, 80, 88, 8443

## Links
- https://core.telegram.org/bots/faq#how-do-i-create-a-bot
- https://core.telegram.org/bots/api


## Received messages examples

Example direct message to bot

```
{
  update_id: 129378494,
  message: {
    message_id: 23,
    from: {
      id: 49999993,
      is_bot: false,
      first_name: 'NAME',
      username: 'NAME_SURNAME',
      language_code: 'en'
    },
    chat: {
      id: 49999993,
      first_name: 'NAME',
      username: 'NAME_SURNAME',
      type: 'private'
    },
    date: 1713174391,
    text: 'k9i9ug'
  }
}

```

Example of message coming from a channel
```
Got new incoming post request
{
  update_id: 129378496,
  channel_post: {
    message_id: 52,
    sender_chat: {
      id: -1009999999999,
      title: 'CHANNEL_TITLE',
      type: 'channel'
    },
    chat: {
      id: -1002010017589,
      title: 'CHANNEL_TITLE',
      type: 'channel'
    },
    date: 1713174670,
    text: '1234qwer'
  }
}

```
