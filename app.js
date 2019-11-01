'use strict';
const env = require('dotenv').config();
const Discord = require("discord.js");
const client = new Discord.Client;
//const Guild = new Discord.Guild;

let norpReady = true;

client.on('message', msg => {

    //The core of the bot. The Norp command, with timeout for spam control.
    if (msg.content === "!norp" || msg.content === "!Norp") {
        if(norpReady === true){
            msg.reply("Norp.");
            norpReady = false;
            setTimeout(function () {
                console.log("Wait done. Enabling Norp.");
                norpReady = true;
            }, 5000)
        }
        else{
            console.log("Norp not ready.");
            console.log(norpReady)
        }
    }
    if (msg.content ==="!source" || msg.content === "!Source" ){
        msg.author.send("A link to the Norpbot source code: http://www.github.com/snorp09/NorpBot")
    }

    //!Offline preforms a clean shutdown of the bot. Requires Administrator permissions.
    try{
        if(msg.content === "!offline" && msg.member.hasPermission("administrator")){
            client.destroy().then( function () {
                console.log("Client Destroyed.");
            });
        }
    }
    //Catches errors from !offline. Most common types are handled, and the bot will reply with recommend trouble shooting.
    catch (error) {
        console.log("Caught Error: " + error);
        if(error instanceof RangeError){
            msg.reply("An error has occurred. This type is usually cased by wrong permissions. Are you admin? ")
        }
        else if(error instanceof TypeError){
            msg.channel.send("An error has occurred. This type is usually caused by trying to set the bot offline in DMs. Try outside of DMs.")
        }
        else{
            msg.reply("An unknown type of error has occurred. Please check your node.js console for details, and possibly make an issue request at https://github.com/snorp09/NorpBot/issues");
            msg.channel.send("They'll want have a copy of the error you've received in your node.js console, if you opt to make a issue.")
        }
    }
});

client.login(process.env.BOT_TOKEN).then(function () {
    console.log("Login Complete.")
});
