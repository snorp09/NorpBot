'use strict';
const env = require('dotenv').config();
const Discord = require("discord.js");
const client = new Discord.Client;
const Guild = new Discord.Guild;

client.on('message', msg => {
    if (msg.content === "!norp" || msg.content === "!Norp") {
        msg.reply(" Norp.")
    }
    if (msg.content ==="!source" || msg.content === "!Source" ){
        msg.author.send("A link to the Norpbot source code: http://www.github.com/snorp09/NorpBot")
    }
})

client.login(process.env.BOT_TOKEN)