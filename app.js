'use strict';
const env = require('dotenv').config();
const Discord = require("discord.js");
const client = new Discord.Client;
//const Guild = new Discord.Guild;

//Here we set our abuse timers initial values.
var norpReady = true;
var rollReady = true;

client.on('message', msg => {
    //Case insensitive command parser 
    function commandparse(command) {
        if(msg.content.toLocaleLowerCase().includes(command) && !msg.content.toLocaleLowerCase().includes(" " + command)){
            return true;
        }
    }

    if(msg.author.bot){
        return;
    }

    //The core of the bot. The Norp command, with timeout for spam control.
    if (commandparse("!norp")) {
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
    if(commandparse("!help")){
        msg.author.send("You can see the commands on the follow page. https://github.com/snorp09/NorpBot/wiki/Bot-Commands")
    }

    //!Source will send a link to the Norpbot source code to whoever sends the command.
    if (commandparse("!source")){
        msg.author.send("A link to the Norpbot source code: http://www.github.com/snorp09/NorpBot")
    }

    //!Offline preforms a clean shutdown of the bot. Requires Administrator permissions.
    try{
        if(commandparse("!offline") && msg.member.hasPermission("ADMINISTRATOR")){
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

    function rollDice(size) {
        let numb = Math.floor(Math.random() * size + 1);
        if(numb === 0){
            numb = 1;
        }
        return numb

    }


    //Code for the !Roll Command.
    if(rollReady === true) {
        if (commandparse("!roll")) {
            //Let's declare our values.
            let diceSize = parseInt(msg.content.split(' ')[1])
            let rollnumb = parseInt(msg.content.split(' ')[2])

            if (typeof diceSize == 'undefined') {
                msg.reply("!roll requires a size of dice.");
                return;
            }
            if (isNaN(diceSize)) {
                msg.reply("!roll requires a size of dice.");
                return;
            }
            //Sets max size for dice, to prevent insanely high numbers
            if (diceSize > 100000) {
                msg.reply("Max size of dice is 100,000");
                return;
            }

            if (typeof rollnumb == 'number' && !isNaN(rollnumb)) {

                //Max number of dice rollable. Too high can hit Discord's API Limit. Will result in a bot crash. Also can cause massive spam.
                if (rollnumb > 20) {
                    msg.reply("Max roll count is 20.");
                    return;
                }

                let results = ""
                //Time to roll.
                for (let roll = 0; rollnumb > roll; roll++) {
                    //If final roll, don't add a comma
                    if (roll === rollnumb - 1) {
                        results = results + rollDice(diceSize);
                    } else {
                        results = results + rollDice(diceSize) + ", ";
                    }
                }
                msg.reply("You rolled: " + results)
            }else {
                rollDice(diceSize)
                msg.reply("You rolled " + rollDice(diceSize));
            }
            rollReady = false;
            //Abuse prevention timer.
            setTimeout(() =>{
                rollReady = true;
            }, 5000)
        }
    }
//The code for the VCNorp command
    if(commandparse("!vcnorp")){
        //Are you in a server?
        if(!msg.guild) return;
        
        //Are you actually in a Voice Channel?
        if(msg.member.voiceChannel){
            console.log("VCNorping.");
            const channel = msg.member.voiceChannel.join();
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
