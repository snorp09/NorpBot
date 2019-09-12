'use strict';
const env = require('dotenv').config();
const Discord = require("discord.js");
const client = new Discord.Client;
const Guild = new Discord.Guild;

client.on('message', msg => {
    if (msg.content === "!norp" || msg.content === "!Norp") {
        msg.reply(" Norp.");
    }
    if (msg.content ==="!source" || msg.content === "!Source" ){
        msg.author.send("A link to the Norpbot source code: http://www.github.com/snorp09/NorpBot")
    }
    try{
        if(msg.content === "!offline" && msg.member.hasPermission("administrator")){
            client.destroy();
        }
    }
    //Catches all error regarding permissions. TODO Add different messages for each type of errors
    catch (error) {
        console.log("Caught Error: " + error);
        msg.reply("Error while running '!offline' command. Are you in DMs?");
    }
    if(msg.content === "!vcNorp"){
        let channel = msg.member.voiceChannel.join();
        const broadcast = client.createVoiceBroadcast();
        broadcast.playFile("VCAudio/Norp.mp3");
        for (const connect of client.voiceConnections.values()) {
            connect.playBroadcast(broadcast)
        }
    }
    if(msg.content === "!vcremove"){
        msg.member.voiceChannel.leave()
        console.log("Tried leaving")
    }
});

client.login(process.env.BOT_TOKEN);