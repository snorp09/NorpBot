'use strict';
const env = require('dotenv').config();
const Discord = require("discord.js");
const client = new Discord.Client;
//const Guild = new Discord.Guild;

//Set the norpReady to true on power on.
let norpReady = true;

client.on('message', async msg => {

    if(msg.author.bot){
        return;
    }

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
        }
    }

    //!Help links to my Github Wiki Page on Norpbot Commands.
    //IF YOU MODIFY THE PROGRAM, CHANGE THIS TO YOUR LINK ON COMMANDS.
    if(msg.content === "!help" || msg.content === "!Help"){
        msg.author.send("You can see the commands on the follow page. https://github.com/snorp09/NorpBot/wiki/Bot-Commands")
    }

    //!Source will send a link to the Norpbot source code to whoever sends the command.
    if (msg.content ==="!source" || msg.content === "!Source" ){
        msg.author.send("A link to the Norpbot source code: http://www.github.com/snorp09/NorpBot")
    }

    //!Offline preforms a clean shutdown of the bot. Requires Administrator permissions.
    try{
        if(msg.content === "!offline" && msg.member.hasPermission("ADMINISTRATOR") || msg.content === "!Offline" && msg.member.hasPermission("ADMINISTRATOR")){
            client.destroy().then( function () {
                console.log("Client Destroyed.");
            });
        }
    }
    //Catches errors from !offline. Most common types are handled, and the bot will reply with recommend trouble shooting.
    catch (error) {
        console.log("Caught Error: " + error);
        if(error instanceof RangeError){    //Error handling message for permissions.
            msg.reply("An error has occurred. This type is usually cased by wrong permissions. Are you admin? ")
        }
        else if(error instanceof TypeError){ //Permissions don't exist in DMs, so it'll have null type which isn't expected.
            msg.channel.send("An error has occurred. This type is usually caused by trying to set the bot offline in DMs. Try outside of DMs.")
        }
        else{   //Catches other errors. Links to Norpbot issue page to report the error.
            msg.reply("An unknown type of error has occurred. Please check your node.js console for details, and possibly make an issue request at https://github.com/snorp09/NorpBot/issues");
            msg.channel.send("They'll want have a copy of the error you've received in your node.js console, if you opt to make a issue.")
        }
    }


    //Code for the !Roll Command.
    if(msg.content.includes("!Roll") || msg.content.includes("!roll") && !msg.content.includes(" !Roll") && !msg.content.includes(" !roll")){
        let rollnumb = msg.content.split(" ")[1];
        if(typeof rollnumb == 'undefined'){
            msg.reply("!roll requires a size of dice.");
            return;
        }
        if(isNaN(rollnumb)){
            msg.reply("!roll requires a size of dice.");
            return;
        }
        let numb = Math.floor(Math.random() * rollnumb + 1);
        if(numb === 0){
            numb = 1;
        }
        msg.reply("You rolled a " + numb);
    }

//The code for the VCNorp command
    if(msg.content === "!VCNorp"){
        //Are you in a server?
        if(!msg.guild) return;
        
        //Are you actually in a Voice Channel?
        if(msg.member.voiceChannel){
            console.log("VCNorping.");
            const channel = await msg.member.voiceChannel.join();
            const play = channel.playFile("./VCAudio/Norp.mp3");
            //Leave after playing file.
            play.on('end', () =>{
                channel.channel.leave();
            })
        }
        //Not in a VC channel. Give error.
        else{
            msg.reply("You must be in a voice channel to be Norped.");
        }
    }

});

client.login(process.env.BOT_TOKEN).then(function () {
    console.log("Login Complete.")
});
