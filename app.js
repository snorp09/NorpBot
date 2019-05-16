'use strict';
const env = require('dotenv').config();
const Discord = require("discord.js");
const client = new Discord.Client;
const Guild = new Discord.Guild;

client.on('message', msg => {
    if (msg.content === "!norp") {
        msg.reply(" Norp.")
    }
    if (msg.content === "!NE" && msg.author.username === "Snorp09") {
        console.log(process.env.TEST)
    }
})

client.login(process.env.BOT_TOKEN)