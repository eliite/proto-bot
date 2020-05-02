'use strict';

const cv = require('canvas').createCanvas(1280,1280);
const Canvas = cv.getContext('2d');
const Discord = require('discord.js');
const Enmap = require('enmap');

const config = require('./config.json');
const client = new Discord.Client();

var deletedMessages = [];
var defaultSettings;

client.on('ready', () => {
    console.clear();
    console.log("PROTOTYPE LOADED");
    client.user.setActivity("commands | !help", {type: "STREAMING", url: "https://www.twitch.tv/protobot0"});

    initCanvas(Canvas);
    initEnmap();
});

client.on('message', message => {
    if (!message.guild || message.author.bot) return;

    const guildSettings = client.settings.ensure(message.guild.id, defaultSettings);
    initGuildSettings(message, guildSettings);

    if (!message.content.startsWith(guildSettings.prefix)) return;

    const args = message.content.split(/\s+/g);
    const command = args.shift().slice(guildSettings.prefix.length).toLowerCase();

    console.log(`COMMAND: ${command} - ARGS: ${args}`);

    if (command === "help") {
        if (args.toString().length > 0) {
            let [sub, ...app] = args;

            if (app === undefined || app === null || app.length === 0) {
                botMessage(message, "ERROR: Please insert a category. Usage: !help category [category]");
                return;
            }
            app = app.toString().match(/[A-Z]/gi)

            if (app === undefined || app === null || app.length === 0) {
                botMessage(message, "ERROR: Invalid category. No alphabetical characters located.");
                return;
            }
            app = app.toString().replace(/,/g, "").toLowerCase();

            if (sub === 'category') {
                let composite = '';
                for (let i = 0; i < command_list.length; i++) {
                    if (app === command_list[i][0].toLowerCase()) {
                        if (command_list[i][3] === undefined)
                            composite += `**${command_list[i][1]}**\nDescription: ${command_list[i][2]}\nUsage: !${command_list[i][1].toLowerCase()}\n\n`;
                        else 
                            composite += `**${command_list[i][1]}**\nDescription: ${command_list[i][2]}\nUsage: ${command_list[i][3]}\n\n`;
                    }
                }
                if (composite === '') {
                    botMessage(message, "ERROR: No matching category found.");
                    return;
                } else {
                    let embed =
                    createEmbed(
                        `${app}`,
                        "A list and description of every functioning command in a specified category.", "", 
                        "", "", false, "")
                    .addField("Commands", composite);

                    message.channel.send(embed)
                    .catch(console.error);
                    return;
                }
            } else {
                let app = args.toString()
                            .replace(/,/gi, " ")
                            .match(/[A-Z]| /gi).toString()
                            .replace(/,/gi, "").toLowerCase();

                for (let i = 0; i < command_list.length; i++) {
                    if (app === command_list[i][1].toLowerCase().replace(/\[|\]/g, "")) {
                        let embed = 
                        createEmbed(
                            "", 
                            "", "", "", false, 
                            command_list[i][1], "")
                        .addFields(
                            { name: "Description", value: `${command_list[i][2][0].toUpperCase()}${command_list[i][2].slice(1)}.` },
                            { name: "Usage", value: ((command_list[i][3] === undefined) ? `!${command_list[i][1].toLowerCase()}` : `${command_list[i][3]}`)}
                        );
                        message.channel.send(embed)
                        .catch(console.error);
                        return;
                    }
                    else if (i === command_list.length - 1) {
                        botMessage(message, "No matching command found.");
                        return;
                    }
                }
            }
        } else {
            let embed =
            createEmbed(
                "Command list",
                "A list and description of every functioning command.", "", 
                "", "", false, ""), placeholder = '', composite = '';

            for (var i = 0; i < command_list.length; i++) {
                if (!(command_list[i][0] === placeholder) && i != 0) {
                    if (composite.length > 0) {
                        embed.addField(placeholder, composite, false);
                    }
                    composite = '';
                }
                placeholder = command_list[i][0];
                composite += `**${command_list[i][1]}** ${command_list[i][2]}\n`
                if (i === command_list.length - 1) {
                    if (composite.length > 0) {
                        embed.addField(placeholder, composite, false);
                    }
                }
            }
            message.channel.send(embed)
            .catch(console.error);
        }
    }
    else if (command === "prefix") {
        let prefix = String(args).replace(/,/g, '');
        if (prefix === '') {
            botMessage(message, "You cannot set the server prefix to null."); 
            return;
        }
        else if (prefix === guildSettings.prefix) {
            botMessage(message, "New prefix is identical to current.");
            return;
        }

        let embed = 
        createEmbed(
            "Prefix modification",
            "Set the prefix of the server.", "", 
            "", "", false, "")
        .addFields(
            { name: 'Before', value: `${guildSettings.prefix}` },
            { name: 'After', value: `${prefix}` }
        );

        message.channel.send(embed)
        .catch(console.error);

        client.settings.set(message.guild.id, prefix, "prefix");
    }
    else if (command === "nick") {
        let nickname = String(args).replace(/,/g, " ");
        if (nickname === '') {
            botMessage(message, "Please specify a nickname.");
            return;
        }
        else if (nickname.length > 32) 
            botMessage(message, "WARNING: Nickname will be shortened to 32c.");

        let embed = 
        createEmbed(
            "[BOT] Name change",
            "Set the nickname of the bot.", "", 
            "", "", false, "")
        .addFields(
            { name: 'Before', value: `${(message.guild.member(client.user).nickname === null) ? client.user.username : message.guild.member(client.user).nickname}` },
            { name: 'After', value: `${nickname}` }
        );

        message.guild.member(client.user).setNickname(nickname.slice(0,32))
        .catch(console.error);

        message.channel.send(embed)
        .catch(console.error);
    }
    else if (command === "info") {
        let embed = 
        createEmbed(
            "Bot information", "", 
            "", "", 
            "", false, "")
        .addFields(
            {name: "Version", value: "0.1.0", inline: true},
            {name: "Creation", value: "May 1 2020", inline: true},
            {name: "Creator", value: "elite#0001", inline: true},
            {name: "Servers", value: `${client.guilds.cache.size}`, inline: true},
            {name: "Users", value: `${client.users.cache.size}`, inline: true},
            {name: "Website", value: "https://darkzone.vip", inline: true},
        ); 
        message.channel.send(embed)
        .catch(console.error);
    }
    else if (command === "reverse") {
        if (message.content.length <= 8) {
            botMessage(message, "ERROR: No message to reverse found. Usage: !reverse [phrase]");
            return;
        }

        let app = message.content.slice(8), reverse = '';
        for (let i = app.length - 1; i >= 0; i--) 
            reverse += app[i];

        let embed = 
        createEmbed(
            "Text reversal", 
            "Reverse text passed to the bot.", "", "",
            "", false, "")
        .addFields(
            { name: "Before", value: app},
            { name: "After", value: reverse}
        );
        message.channel.send(embed);
    }
    else if (command === "rps") {
        let choice = [ [ "rock", "paper", "scissors" ], [ "paper", "rock", "scissors" ], [ "scissors", "rock", "paper"]];
        let victory = [ [ "rock", "paper" ], [ "paper", "scissors" ], [ "scissors", "rock" ] ];
        let bot_choice = choice[0][Math.floor(Math.random() * 3)], win = false; 

        let user_choice = args.toString().match(/[rock]|[paper]|[scissors]/gi).toString().replace(/,/gi, ""), pos = -1;
        for (let i = 0; i < choice[0].length; i++) {
            pos = user_choice.toLowerCase().indexOf(choice[0][i]);
            if (pos !== -1)
                user_choice = choice[0][i];
        } if (user_choice !== undefined && user_choice.length > 0) {
            while (bot_choice === user_choice) {
                bot_choice = choice[0][Math.floor(Math.random() * 2)];
             }

            switch (user_choice) {
                case "rock":
                    win = (bot_choice === "scissors");
                    break;
                case "scissors":
                    win = (bot_choice === "rock");
                    break;
                case "paper":
                    win = (bot_choice === "scissors");
                    break;
                default:
                    botMessage(message, "ERROR: User input was not rock, paper, or scissors.");
                    return;
            }

            let embed = 
            createEmbed(
                "Results", 
                win ? "You won!" : "You lost.", "", "",
                "", false, "")
            .addFields(
                { name: "Your choice", value: `${user_choice[0].toUpperCase()}${user_choice.slice(1)}`},
                { name: "Bot's choice", value: `${bot_choice[0].toUpperCase()}${bot_choice.slice(1)}`}
            );
            message.channel.send(embed)
            .catch(console.error);
            return;
        }
    }
    else if (command === 'flip') {
        let embed = 
        createEmbed(
            "Result", 
            `The coin landed on ${Math.round(Math.random()) ? "heads" : "tails"}.`, "", "",
            "", false, "")

        message.channel.send(embed)
        .catch(console.error);
    }
    else if (command === 'snipe') {
        let time = 0, ind = -1;
        for (let i = 0; i < deletedMessages.length; i++) {
            if (deletedMessages[i] !== undefined && 
                deletedMessages[i].createdTimestamp > time && 
                deletedMessages[i].channel.id === message.channel.id) {

                time = deletedMessages[i].createdTimestamp;
                ind = i;
            }
        }

        if (deletedMessages[ind] !== undefined && deletedMessages[ind].content.length > 0) {
            let embed =
            createEmbed(
                "", deletedMessages[ind].content, 
                "", "",
                "", false, "")
            .setAuthor(deletedMessages[ind].author.username, deletedMessages[ind].author.displayAvatarURL())
            .setThumbnail("");

            message.channel.send(embed)
            .catch(embed);
        }
        else {
            botMessage(message, "No recently-deleted messages found.");
            return;
        }
    }
    else if (command === 'color') {
        if (String(args) === undefined || String(args).indexOf("#") === -1) {
            botMessage(message, "ERROR: Please use a color in the form #000 or #000000.");
            return;
        }

        let color = String(args).match(/(#[A-F|0-9][A-F|0-9][A-F|0-9][A-F|0-9][A-F|0-9][A-F|0-9])|(#[A-F|0-9][A-F|0-9][A-F|0-9])/gi);
        if (color !== undefined && color.length > 0)
            color = color.toString().replace(/[#,]/g, "");
            
        if (color.length === 3)
            color = color[0] + color[0] +
                    color[1] + color[1] +
                    color[2] + color[2];

        let color_num = [
            parseInt(color[0], 16)*16+parseInt(color[1], 16),
            parseInt(color[2], 16)*16+parseInt(color[3], 16),
            parseInt(color[4], 16)*16+parseInt(color[5], 16)
        ];
        let embed = 
        createEmbed(
            `#${color.toString().toUpperCase()}`, "Representation of a color in different formats.", 
            "", "",
            "", false, "")
        .setColor(color_num)
        .addFields(
            { name: "RGB - red, green, blue", value: `(${color_num[0]}, ${color_num[1]}, ${color_num[2]})`},
            { name: "Decimal - from 0 to 16777216", value: `${color_num[0]*color_num[1]*color_num[2]}`},
            { name: "CMY - cyan, magenta, yellow", value: `(${((255-color_num[0])/255).toFixed(4)}, ${((255-color_num[1])/255).toFixed(4)}, ${((255-color_num[2])/255).toFixed(4)})`},
            { name: "XYZ - color wheel coordinates", value: '(' +
                (((color_num[0]/255)>0.04045)?Math.pow((((color_num[0]/255)+0.055)/1.055),2.4)*100:(color_num[0]/255)/12.92*100).toFixed(4).toString() + ", " +
                (((color_num[1]/255)>0.04045)?Math.pow((((color_num[1]/255)+0.055)/1.055),2.4)*100:(color_num[1]/255)/12.92*100).toFixed(4).toString() + ", " +
                (((color_num[2]/255)>0.04045)?Math.pow((((color_num[2]/255)+0.055)/1.055),2.4)*100:(color_num[2]/255)/12.92*100).toFixed(4).toString() + ')'}
        );
        message.channel.send(embed)
        .catch(embed);
    }
    else if (command === 'rcolor') {
        let color = (Math.floor(Math.random() * 16777215)).toString(16);
        let color_num = [
            parseInt(color[0], 16)*16+parseInt(color[1], 16),
            parseInt(color[2], 16)*16+parseInt(color[3], 16),
            parseInt(color[4], 16)*16+parseInt(color[5], 16)
        ];
        let embed = 
        createEmbed(
            `#${color.toString().toUpperCase()}`, "Representation of a color in different formats.", 
            "", "",
            "", false, "")
        .setColor(color_num)
        .addFields(
            { name: "RGB - red, green, blue", value: `(${color_num[0]}, ${color_num[1]}, ${color_num[2]})`},
            { name: "Decimal - from 0 to 16777216", value: `${color_num[0]*color_num[1]*color_num[2]}`},
            { name: "CMY - cyan, magenta, yellow", value: `(${((255-color_num[0])/255).toFixed(4)}, ${((255-color_num[1])/255).toFixed(4)}, ${((255-color_num[2])/255).toFixed(4)})`},
            { name: "XYZ - color wheel coordinates", value: '(' +
                (((color_num[0]/255)>0.04045)?Math.pow((((color_num[0]/255)+0.055)/1.055),2.4)*100:(color_num[0]/255)/12.92*100).toFixed(4).toString() + ", " +
                (((color_num[1]/255)>0.04045)?Math.pow((((color_num[1]/255)+0.055)/1.055),2.4)*100:(color_num[1]/255)/12.92*100).toFixed(4).toString() + ", " +
                (((color_num[2]/255)>0.04045)?Math.pow((((color_num[2]/255)+0.055)/1.055),2.4)*100:(color_num[2]/255)/12.92*100).toFixed(4).toString() + ')'}
        );
        message.channel.send(embed)
        .catch(embed);
    }
    else if (command === "draw") {
        let [sub, ...app] = args;
        if (sub === 'color') {
            let color = String(app).match(/(#[A-F|0-9][A-F|0-9][A-F|0-9][A-F|0-9][A-F|0-9][A-F|0-9])|(#[A-F|0-9][A-F|0-9][A-F|0-9])/gi);
            if (color !== undefined && color !== null && color.length > 0)
                color = color.toString().replace(/[#,]/g, "");
            else {
                botMessage(message, "ERROR: Please use a color in the form #000 or #000000.");
                return;
            }

            if (color === '') {
                botMessage(message, "ERROR: Please use a color in the form #000 or #000000.");
                return;
            }
                
            if (color.length === 3)
                color = color[0] + color[0] +
                        color[1] + color[1] +
                        color[2] + color[2];

            Canvas.fillStyle = `#${color}`;
            botMessage(message, `Color changed to #${color}.`);
            return;
        } else if (sub === 'save') {
            let attachment = new Discord.MessageAttachment(cv.toBuffer(), 'canvas.png');
            message.channel.send("", attachment);
            return;
        } else if (sub === 'reset') {
            let old_color = Canvas.fillStyle;

            Canvas.fillStyle = '#FFFFFF';
            Canvas.fillRect(0, 0, 1280, 1280);
            Canvas.fillStyle = old_color;

            botMessage(message, "Successfully reset canvas.");
            return;
        } else if (sub === 'random') {
            let count = 
                Math.min(Math.max(
                parseInt(app.toString().match(/[0-9]/g).toString().replace(/,/g, "")), 1),
                999);

            let old_color = Canvas.fillStyle;
            for (let i = 0; i < count; i++) {
                Canvas.fillStyle = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
                Canvas.fillRect(
                    Math.floor(Math.random() * 1280),
                    Math.floor(Math.random() * 1280),
                    Math.floor(Math.random() * 1280),
                    Math.floor(Math.random() * 1280),
                );
            } Canvas.fillStyle = old_color;

            let attachment = new Discord.MessageAttachment(cv.toBuffer(), "../assets/cvbuffer.png");
            let embed = 
            createEmbed(
                "Drawing canvas", "Server-wide drawing board.", 
                "", "",
                "", false, "")
            .setImage('attachment://cvbuffer.png')
            .addField("Usage", "**!draw (x,y,w,h)** - draws with the given position and size\n\n**!draw color #000 (or #000000)** - specifies color");

            message.channel.send({files: [attachment], embed: embed})
            .catch(console.error);
            return;
        } else if (sub === 'circle') {
            let origin = app.toString().match(/[0-9]{1,999}/g);
            if (origin === undefined || 
                origin === null || 
                origin.length !== 3 && origin.length !== 5) {
                    botMessage(message, "ERROR: Use coordinates in the form (x, y, r)");
                    return;
                }

            Canvas.beginPath();
            Canvas.arc(
                Math.min(origin[0], 1280), Math.min(origin[1], 1280), Math.min(origin[2], 1280),
                (origin.length === 5) ? origin[3] : 0,
                (origin.length === 5) ? origin[4] : 2*Math.PI);
            Canvas.fill();
            Canvas.closePath();

            let attachment = new Discord.MessageAttachment(cv.toBuffer(), "../assets/cvbuffer.png")
            let embed = 
            createEmbed(
                "Drawing canvas", "Server-wide drawing board.", 
                "", "",
                "", false, "")
            .setImage('attachment://cvbuffer.png')
            .addField("Usage", "**!draw (x,y,w,h)** - draws with the given position and size\n\n**!draw color #000 (or #000000)** - specifies color");

            message.channel.send({files: [attachment], embed: embed})
            .catch(console.error);
            return;
        } else {
            if (args === undefined || 
                args === null || 
                args.length === 0) {
                    botMessage("ERROR: Use coordinates in the form (x, y, w, h)");
                    return;
            }
            let origin = String(args).match(/[0-9]{1,999}/g);

                         console.log(origin);
            if (origin === undefined || 
                origin === null || 
                origin.length !== 2 && origin.length !== 4) {
                    botMessage(message, "ERROR: Use coordinates in the form (x, y, w, h)");
                    return;
            }

            Canvas.fillRect(
                Math.min(origin[0], 1280), Math.min(origin[1], 1280),
                (origin.length === 4) ? origin[2] : 16,
                (origin.length === 4) ? origin[3] : 16
            );
            let attachment = new Discord.MessageAttachment(cv.toBuffer(), "../assets/cvbuffer.png");
            let embed = 
            createEmbed(
                "Drawing canvas", "Server-wide drawing board.", 
                "", "",
                "", false, "")
            .setImage('attachment://cvbuffer.png')
            .addField("Usage", "**!draw (x,y,w,h)** - draws with the given position and size\n\n**!draw color #000 (or #000000)** - specifies color");

            message.channel.send({files: [attachment], embed: embed})
            .catch(console.error);
            return;
        }
    }
    else if (command === "echo") {
        if (!message.author.bot && !message.guild.member(message.author).bannable) {
            if (message.content.length > 6) {
                message.channel.send(message.content.slice(6))
                .catch(console.error);
                return;
            } else {
                botMessage(message, "ERROR: Include a phrase for the BOT to repeat.");
                return;
            }
        } else {
            botMessage(message, "ERROR: Only users above the BOT can use !echo.");
            return;
        }
    }
    else if (command === "uptime") {
        let time = client.uptime;
        var weeks = Math.floor(time/1000/60/60/24/7).toString();
        var days = Math.floor((time-(weeks*7*24*60*60*1000))/1000/60/60/24).toString();
        var hours = Math.floor((time-((weeks*7*24*60*60*1000)+(days*24*60*60*1000)))/1000/60/60).toString();
        var minutes = Math.floor((time-((weeks*7*24*60*60*1000)+(days*24*60*60*1000)+(hours*60*60*1000)))/1000/60).toString();
        var seconds = Math.floor((time-((weeks*7*24*60*60*1000)+(days*24*60*60*1000)+(hours*60*60*1000)+(minutes*60*1000)))/1000).toString();

        let embed = 
            createEmbed(
                "Specific uptime", "View exactly how long the bot has been online.", 
                "", "",
                "", false, "")
            .addField(
                "Uptime", (
                ((weeks > 0) ? (weeks + ((weeks !== 1) ? " weeks, " : " week, ")) : "") + 
                ((days > 0) ? (days + ((days !== 1) ? " days, " : " day, ")) : "") +
                ((hours > 0) ? (hours + ((hours !== 1) ? " hours, " : " hour, ")) : "") +
                ((minutes > 0) ? (minutes + ((minutes !== 1) ? " minutes, " : " minute, ")) : "") +
                ((seconds > 0) ? (seconds + ((seconds !== 1) ? " seconds. " : " second. ")) : "") )
            );
        message.channel.send(embed)
        .catch(console.error);   
    }
    else if (command === "prune") {
        let count = '';
        if (args !== undefined &&
            args !== null &&
            args.length > 0)
            count = String(args).match(/[0-9]/g);
        else {
            botMessage(message, "ERROR: Provide a number of messages to delete.");
            return;
        }

        if (count !== undefined &&
            count !== null && 
            count.length > 0 )
            count = parseInt(count.toString().replace(/,/g, ""));
        else {
            botMessage(message, "ERROR: Provide a number of messages to delete.");
            return;
        }
        
        count = Math.min(Math.max(count, 2), 100);
        message.channel.messages.fetch({ limit: count })
        .then(messages => {
            message.channel.bulkDelete(messages)
            .catch(error => {
                if (error.code !== 10008)
                    console.log("ERROR: Failed to delete message");
            })

            let embed = 
            createEmbed(
                "Prune", `${messages.array().length} messages pruned.`, 
                "", "",
                "", false, "");

            botMessage(message, embed, 5000);
        })
        .catch(console.error);
    }
    else if (command === "clean") {
        message.channel.messages.fetch()
        .then(messages => {
            let bot_messages = messages.filter(msg => msg.author === client.user);
            message.channel.bulkDelete(bot_messages)
            .catch(console.error);

            let embed = 
            createEmbed(
                "Clean", `${bot_messages.array().length} BOT messages pruned.`, 
                "", "",
                "", false, "");
            botMessage(message, embed, 5000);
        })
        .catch(console.error);
    }
    else if (command === "nickname") {
        if (message.mentions.users.size !== 1 || String(args).length <= 0) {
            botMessage(message, "ERROR: Mention a user and present a nickname to modify it.");
            return;
        }

        let user = message.mentions.users.first();
        if (!user) {
            botMessage(message, "ERROR: Could not find user.");
            return;
        }

        let nick = message.content.slice(message.content.indexOf(user.id)+user.id.length+2);
        if (nick === undefined ||
            nick === null ||
            nick.length === 0) {
                botMessage(message, "ERROR: Specify a nickname.");
                return;
            }

        message.guild.member(user).setNickname((nick.length > 32) ? nick.slice(0, 32) : nick)
        .catch( a => {
            botMessage(message, "ERROR: Insufficient permissions.");
            return;
        });
    }
    else if (command === "kick") {
        if (message.mentions.users.size !== 1 || String(args).length <= 0) {
            botMessage(message, "ERROR: Mention a user to kick them.");
            return;
        }

        let user = message.mentions.users.first();
        if (!user) {
            botMessage(message, "ERROR: Could not find user.");
            return;
        }

        let member = message.guild.member(user);
        let reason = message.content.slice(message.content.indexOf(user.id)+user.id.length+2);
        if (!member) {
            botMessage(message, "ERROR: Could not find member.");
            return;
        }

        member.kick((reason === '') ? "" : reason)
        .then(a => {
            botMessage(message, `User successfully kicked${(reason === '') ? "" : " {reason: " + reason + "}"}.`);
            return;
        })
        .catch(console.error);
    }
    else if (command === "ban") {
        let [sub, ...app] = args;
        let days = 0, reason = "";

        if (message.mentions.users.size !== 1 && sub !== 'match') {
            botMessage(message, "ERROR: Include a user mention and a number of days.");
            return;
        }

        let user = message.mentions.users.first();
        if (!user && sub !== 'match') {
            botMessage(message, "ERROR: Unable to find user.");
            return;
        }

        if (sub === 'match') {
            let match_plc = message.content.slice(message.content.indexOf(sub)+sub.length+1), b = 0;
            let match_text = match_plc.slice(0, Math.ceil(0.65*match_plc.length));

            let user_list = [];

            message.channel.messages.fetch()
            .then(msg => {
                let len = msg.array().length, arr = msg.array();
                for (let i = 0; i < len; i++) {
                    if (arr[i].content.toLowerCase().indexOf(match_text.toLowerCase()) !== -1 && 
                        arr[i].author !== message.author) {
                        let user = message.guild.member(msg.array()[i].author);

                        if (!user.bannable) continue;

                        if (user_list.length > 0) {
                            for (let x = 0; x < user_list.length; x++) {
                                console.log(user);
                                console.log(user_list[x]);
                                if (x === user_list.length-1 && user_list[x] !== user) {
                                    user
                                    .ban( {days: 7, reason: `Sent messages containing 65% or more of '${match_plc}': '${match_text}'.`})
                                    .then(msg => {
                                        b++;
                                        user_list.push(user);
                                    })
                                    .catch(console.error);
                                    break;
                                } else if (user_list[x] === user) {
                                    break;
                                }
                            }
                        } else {
                            user
                            .ban( {days: 7, reason: `Sent messages containing 65% or more of '${match_plc}': '${match_text}'.`})
                            .then(msg => {
                                b++;
                                user_list.push(user);
                            })
                            .catch(console.error);
                        }

                    }
                    if (i === len - 1) {
                        botMessage(message, (b > 0) ? ((b > 1) ? `SUCCESS: ${b} members banned.` : `SUCCESS: ${b} member banned.`) : `FAILURE: No matching messages found.`);
                        return;
                    }
                }
            })
            return;
        } else if (sub === 'days') {
            if (app === undefined ||
                app === null ||
                app.length === 0) {
                botMessage(message, "ERROR: Include a user mention and a number of days.");
                return;
            }

            days = app.toString().slice(app[0].length+1);
            if (days !== undefined ||
                days !== null ||
                days.length !== 0)
                days = Math.min(Math.max(parseInt(days), 1), 7);

            reason = message.content.slice(message.content.indexOf(app[1])+app[1].length+1);
        } else if (sub === 'save') {
            days = 0;
            reason = message.content.slice(message.content.indexOf(app[0])+app[0].length+1);
        }
        
        let member = message.guild.member(user);
        if (!member) {
            botMessage(message, "ERROR: Unable to find member.");
            return;
        }
        reason = ((reason === '') ? message.content.slice(message.content.indexOf(user.id)+user.id.length+1) : reason);

        member
        .ban( { days: days, reason: reason})
        .then(a => {
            botMessage(message, 
                "User successfully banned" + ((reason === '') ? ";" : ` {reason: ${reason}};`) +
                ((days === 0) ? " no messages removed." : ` ${days} days of messages removed.`));
        })
        .catch(a => {
            botMessage(message, "ERROR: Insufficient permissions.");
            return;
        });
    }
});

client.on("guildDelete", guild => {
    client.settings.delete(guild.id);
});

client.on("messageDelete", message => {
    if (message !== undefined 
        && message !== null
        && !message.author.bot)
    deletedMessages.push(message);

    if (deletedMessages.length >= 128)
        deletedMessages = deletedMessages.slice(64);
});

function initCanvas(context) {
    context.fillStyle = "#FFF";
    context.fillRect(0, 0, 1280, 1280);
    context.fillStyle = "#000";
}

function initEnmap() {
    client.settings = new Enmap({
        name: "settings",
        fetchAll: false,
        autoFetch: true,
        cloneLevel: 'deep'
      });

    defaultSettings = {	
        prefix: "!",	
        modLogChannel: "mod-log",	
        modRole: "Moderator",	
        adminRole: "Administrator",	
        welcomeChannel: "welcome",	
        welcomeMessage: "Say hello to {{user}}, everyone! We all need a warm welcome sometimes :D"	
    }
}

function initGuildSettings(_message, _settings) {
    _message.guild.roles.fetch() 
    .then(roles => { 
        if (_settings.adminRole !== roles.highest.name)
            client.settings.set(_message.guild.id, roles.highest.name, "adminRole");
    })
    .catch(console.error);
}

function createEmbed(
    _title, _description, _footer, 
    _image, _thumbnail, _timestamp, 
    _url, _color="#00909e", _author="") {
        let embed = new Discord.MessageEmbed()
        .setColor(_color);

        if (_description.length > 0)
            embed.setDescription(_description);
        if (_footer.length > 0)
            embed.setFooter(_footer);
        if (_image.length > 0)
            embed.setImage(_image);
        if (_title.length > 0)
            embed.setTitle(_title);
        if (_url.length > 0)
            embed.setURL(_url);
        if (_timestamp)
            embed.setTimestamp();

        if (_thumbnail.length > 0)
            embed.setThumbnail(_thumbnail);
        else 
            embed.setThumbnail('https://cdn.discordapp.com/attachments/703844479458607106/704073461374517331/discord_logo.png');

        if (_author.length > 0)
            embed.setAuthor(_author, '', 'https://darkzone.vip');
        else
            embed.setAuthor('PROTOTYPE', '', 'https://darkzone.vip');

        return embed;
}

function botMessage(_message, _text, _time=15000) {
    _message.channel.send(_text)
    .then (msg => { msg.delete({timeout: _time })})
    .catch(console.error);
}

const command_list = [
    [ "Configuration", "Help", "receive a list of every command"],
    [ "Configuration", "Help [command]", "show usage for a specific command", "!help ban"],
    [ "Configuration", "Help [category]", "receive a list of commands for a category with their usage", "!help category [command]"],
    [ "Configuration", "Prefix", "change the prefix of commands", "!prefix [prefix]"],
    [ "Configuration", "Nick", "set the name of the bot", "!nick [nickname]"],
    [ "Configuration", "Info", "give information about the bot"],

    [ "Fun", "Reverse", "reverse a word or phrase", "!reverse [phrase]"],
    [ "Fun", "RPS", "play rock, paper, scissors", "!rps [rock|paper|scissors]"],
    [ "Fun", "Flip", "flip a coin"],
    [ "Fun", "Color", "show information about a given color", "!color #000(OR #000000 - 3 or 6 digit hex)"],
    [ "Fun", "RColor", "preview a generated color"],
    [ "Fun", "Echo", "make the bot repeat a phrase", "!echo [phrase]"],
    [ "Fun", "Snipe", "Show the most recent deleted message"],

    [ "Draw", "Draw", "create a canvas to modify pixels individually [change color]", "!draw [position x],[position y],[width],[height]"],
    [ "Draw", "Draw [color]", "change the color the canvas uses", "!draw color #000(OR #000000 - 3 or 6 digit hex)"],
    [ "Draw", "Draw [save]", "send an attachment of the current canvas to save"],
    [ "Draw", "Draw [reset]", "reset the canvas"],
    [ "Draw", "Draw [random]", "draw 10 random shapes on the canvas", "!draw random [count]"],
    [ "Draw", "Draw [circle]", "draw a circle with given arguments", "!draw circle (required)[position x],[position y],[radius],(optional)[starting angle],[ending angle]"],

    [ "Moderation", "Uptime", "view how long the bot has been online"],
    [ "Moderation", "Prune", "bulk delete messages younger than 14 days", "!prune [count]"],
    [ "Moderation", "Clean", "clean all bot messages"],
    [ "Moderation", "Setnick", "specify a nickname for a user", "!setnick [nickname]"],
    [ "Moderation", "Kick", "kick a user from the server", "!kick @User#0001 [reason]"],
    [ "Moderation", "Ban", "remove and forbid a user from rejoining", "!ban @User#0001 [reason]"],
    [ "Moderation", "Ban [days]", "ban a user and remove specific days of messages", "!ban days @User#0001 [number of days] [reason]"],
    [ "Moderation", "Ban [save]", "ban a user; but save their messages"],
    [ "Moderation", "Ban [match]", "ban users sending matching text", "!ban match [phrase to match]"]
];

client.login(config.token);