'use strict';

const Discord = require('discord.js');
const Canvas = require('canvas');
const client = new Discord.Client();

const canvas = Canvas.createCanvas(1280, 1280);
const ctx = canvas.getContext('2d');
var color = '';

client.on('ready', () => {
  console.log('I am ready!');
  client.user.setPresence({ activity: { name: 'with motivation' }, status: 'online' })
  
  color = "#000000";
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, 1280, 1280);
});

const UniversalEmbed = new Discord.MessageEmbed()
        .setTitle('CHANGE THIS')
        .setAuthor('PROTOTYPE', '', 'https://darkzone.vip')
        .setThumbnail('https://cdn.discordapp.com/attachments/703844479458607106/704073461374517331/discord_logo.png')
        .setColor('#00909e')
        .setDescription('CHANGE THIS')
        .setTimestamp();

const command_list = [
    [ "Configuration", "Help", "receive a list of every command"],
    [ "Configuration", "Help [command]", "show usage for a specific command", "!help ban"],
    [ "Configuration", "Prefix", "change the prefix of commands", "!prefix [prefix]"],
    [ "Configuration", "Nick", "set the name of the bot", "!nick [nickname]"],
    [ "Configuration", "Info", "give information about the bot"],

    [ "Fun", "Reverse", "reverse a word or phrase", "!reverse [phrase]"],
    [ "Fun", "RPS", "play rock, paper, scissors", "!rps [rock|paper|scissors]"],
    [ "Fun", "Flip", "flip a coin"],
    [ "Fun", "Color", "show information about a given color", "!color #000(OR #000000 - 3 or 6 digit hex)"],
    [ "Fun", "RColor", "preview a generated color"],
    [ "Fun", "Echo", "make the bot repeat a phrase", "!echo [phrase]"],

    [ "Draw", "Draw", "create a canvas to modify pixels individually [change color]", "!draw [position x],[position y],[width],[height]"],
    [ "Draw", "Draw [pen]", "change the color of the pen the canvas uses", "!draw pen #000(OR #000000 - 3 or 6 digit hex)"],
    [ "Draw", "Draw [save]", "send an attachment of the current canvas to save"],
    [ "Draw", "Draw [reset]", "reset the canvas"],
    [ "Draw", "Draw [random]", "draw 10 random shapes on the canvas", "!draw random [count]"],
    [ "Draw", "Draw [circle]", "draw a circle with given arguments", "!draw circle (required)[position x],[position y],[radius],(optional)[starting angle],[ending angle]"]

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

var pen_color = '';
var prefix = '!';
client.on('message', message => {
    if (message.content.startsWith(String(prefix), 0) && !message.author.bot && message.guild.id === '702693866393960509') {
        const args = message.content.slice(String(prefix).length).split(' ');
        const command = args.shift().toLowerCase();

        switch (String(command)) {
            case 'help':
                if (String(args).length > 0) {
                    let new_msg = message.content.slice(6, message.content.length).replace(/ {2,9999}/gi, " ");
                    if (new_msg.indexOf(" ") !== -1) {
                        if (new_msg.indexOf("[") === -1)
                            new_msg = `${new_msg.slice(0, new_msg.indexOf(" ") + 1)}[${new_msg.slice(new_msg.indexOf(" ") + 1, new_msg.length)}`;
                        if (new_msg.indexOf("]") === -1)
                            new_msg = `${new_msg}]`;
                    }

                    for (let i = 0; i < command_list.length; i++) {
                        if (command_list[i][1]) {
                            if (new_msg === command_list[i][1].toLowerCase()) {

                                let helpEmbed2 = new Discord.MessageEmbed(UniversalEmbed);
                                if (command_list[i][3] === undefined) {
                                    helpEmbed2
                                    .setTitle(command_list[i][1])
                                    .setDescription("")
                                    .addField("Description", `${command_list[i][2]}`)
                                    .addField("Usage", `!${command_list[i][1].toLowerCase()}`);
                                }
                                else {
                                    helpEmbed2
                                    .setTitle(command_list[i][1])
                                    .setDescription("")
                                    .addField("Description", `${command_list[i][2]}`)
                                    .addField("Usage", `${command_list[i][3]}`);
                                }

                                message.channel.send(helpEmbed2)
                                .catch(console.error);
                            }
                        }
                    }
                }
                else {
                    var helpEmbed = new Discord.MessageEmbed(UniversalEmbed);
                    var placeholder = '', composite = '';
                    for (var i = 0; i < command_list.length; i++) {
                        if (!(command_list[i][0] === placeholder) && i != 0) {
                            if (composite.length > 0) {
                                helpEmbed.addField(placeholder, composite, false);
                            }
                            composite = '';
                        }
                        placeholder = command_list[i][0];
                        composite += `**${command_list[i][1]}** ${command_list[i][2]}\n`
                        if (i === command_list.length - 1) {
                            if (composite.length > 0) {
                                helpEmbed.addField(placeholder, composite, false);
                            }
                        }
                    }
                    helpEmbed
                    .setTitle('Command list')
                    .setDescription('A list and description of every functioning command.');

                    message.channel.send(helpEmbed);
                }
                break;

            case 'prefix':
                if (String(args).replace(' ', '') === '') {
                    message.channel.send(`You cannot set the server prefix to null.`)
                    .then (msg => { msg.delete({timeout: 5000 })})
                    .catch(console.error);
                    break;
                }
                if (String(args) === String(prefix)) {
                    message.channel.send(`New prefix is identical to current.`)
                    .then (msg => { msg.delete({timeout: 5000 })})
                    .catch(console.error);
                    break;
                }

                var prefixEmbed = new Discord.MessageEmbed(UniversalEmbed)
                .setTitle('Prefix modification')
                .setDescription('Set the prefix of the server.')
                .addFields(
                    { name: 'Before', value: `${prefix}` },
                    { name: 'After', value: `${args}` }
                );

                message.channel.send(prefixEmbed);
                prefix = args;
                break;

            case 'nick':
                console.log(String(args));
                if (String(args) === '') {
                    message.channel.send(`Please specify a nickname.`)
                    .then (msg => { msg.delete({timeout: 15000 })})
                    .catch(console.error);
                    break;
                }
                else if (String(args).length > 32) {
                    message.channel.send(`WARNING: Nickname will be shortened to 32c.`)
                    .then (msg => { msg.delete({timeout: 15000 })})
                    .catch(console.error);
                }
                message.guild.member(client.user).setNickname(String(args).slice(0,32));
                break;

            case 'info':
                let infoEmbed = new Discord.MessageEmbed(UniversalEmbed)
                .setTitle("Bot information")
                .setDescription("")
                .addFields(
                    {name: "Version", value: "1.0.0", inline: true},
                    {name: "Creation", value: "April 27 2020", inline: true},
                    {name: "Creator", value: "elite#0001", inline: true},
                    {name: "Servers", value: `${client.guilds.cache.size}`, inline: true},
                    {name: "Users", value: `${client.users.cache.size}`, inline: true},
                    {name: "Website", value: "https://darkzone.vip", inline: true},
                );
                message.channel.send(infoEmbed)
                .catch(console.error);
                break;

            case 'reverse':
                var new_message = message.content.slice(String(prefix).length + String('reverse').length);

                var message2 = '', i;
                if (new_message.length === 0) {
                    message.channel.send('Please send a message to reverse.')
                    .then (msg => { msg.delete({timeout: 5000 })})
                    .catch(console.error);
                    break;
                }

                for (i = new_message.length - 1; i >= 0; i--)
                    message2 += `${new_message[i]}`;

                var reverseEmbed = new Discord.MessageEmbed(UniversalEmbed);

                reverseEmbed
                .setTitle('Text reversal')
                .setDescription('Simple feature to reverse text passed to the bot.')
                .addFields(
                    { name: 'Before', value: `${new_message}` },
                    { name: 'After', value: `${message2}` }
                );

                message.channel.send(reverseEmbed);
                break;

            case 'rps':
                let choice = [ [ "rock", "paper", "scissors" ], [ "paper", "rock", "scissors" ], [ "scissors", "rock", "paper"]];
                let victory = [ [ "rock", "paper" ], [ "paper", "scissors" ], [ "scissors", "rock" ] ];
                let chance = Math.floor((Math.random() * 100) + 1);
                let bot_choice = '', win = false;

                let new_choice = '';
                let pos = -1;

                let new_args = String(args).replace(/([rock]|[paper]|[scissors])/gi, "");
                new_args = String(args).replace(new_args, "");

                for (let i = 0; i < choice[0].length; i++) {
                    pos = String(new_args).toLowerCase().indexOf(choice[0][i]);
                    if (pos === -1 && i !== choice[0].length - 1) continue;
                    else if (pos !== -1) {
                        new_choice = choice[0][i];
                        break;
                    }
                    else 
                        new_choice = '';
                        break;
                }
                if (new_choice === '') {
                    message.channel.send("Invalid input.")
                    .then (msg => { msg.delete({timeout: 5000 })})
                    .catch(console.error);
                    break;
                }

                for (let i = 0; i < choice.length; i++) {
                    if (!(String(new_choice).toLowerCase() === choice[i][0]))
                        continue;
                    else {
                        bot_choice = choice[i][Math.ceil(chance/50)];
                        break;
                    }
                }
                
                if (bot_choice === '')
                    message.channel.send("Invalid input.")
                    .then (msg => { msg.delete({timeout: 5000 })})
                    .catch(console.error);
                else {
                    for (let i = 0; i < victory.length; i++) {
                        if (!(String(new_choice).toLowerCase() === victory[i][0]))
                            continue;
                        else {
                            if (bot_choice !== victory[i][1])
                                win = true;
                            else
                                win = false;

                            break;
                        }
                    }
                }
                
                let rpsEmbed = new Discord.MessageEmbed(UniversalEmbed);

                switch (win) {
                    case true:
                        rpsEmbed
                        .setTitle("Results")
                        .setDescription("You won!")
                        .addField("Your choice", `${String(new_choice).charAt(0).toUpperCase() + String(new_choice).slice(1)}`)
                        .addField("Bot's choice", `${String(bot_choice).charAt(0).toUpperCase() + String(bot_choice).slice(1)}`);

                        message.channel.send(rpsEmbed);
                        break;
                    case false:
                        rpsEmbed
                        .setTitle("Results")
                        .setDescription("You lost.")
                        .addField("Your choice", `${String(new_choice).charAt(0).toUpperCase() + String(new_choice).slice(1)}`)
                        .addField("Bot's choice", `${String(bot_choice).charAt(0).toUpperCase() + String(bot_choice).slice(1)}`);

                        message.channel.send(rpsEmbed);
                        break;
                    default:
                        break;
                }
                break;

            case 'flip':
                let option = [ "heads", "tails" ];
                let percent = Math.round(Math.random());

                let flipEmbed = new Discord.MessageEmbed(UniversalEmbed)
                .setTitle("Result")
                .setDescription(`The coin landed on ${option[percent]}.`)

                message.channel.send(flipEmbed);
                break;

            case 'color':
                let new_colors = [0, 0, 0];
                if (String(args).indexOf("#") === -1) {
                    message.channel.send("Invalid input. Use a color in the form #000 or #000000.")
                        .then (msg => { msg.delete({timeout: 15000 })})
                        .catch(console.error);
                        break;
                }

                let new_color = String(args).replace(/(#[A-Z|0-9][A-Z|0-9][A-Z|0-9][A-Z|0-9][A-Z|0-9][A-Z|0-9])|([^])/gi, '$1').replace("#", "");
                if (new_color === '') {
                    new_color = String(args).replace(/(#[A-Z|0-9][A-Z|0-9][A-Z|0-9])|([^])/gi, '$1').replace("#", "");
                    new_color = `${new_color[0]}${new_color[0]}${new_color[1]}${new_color[1]}${new_color[2]}${new_color[2]}`;
                    if (new_color === '') {
                        message.channel.send("Invalid input. Use a color in the form #000 or #000000.")
                        .then (msg => { msg.delete({timeout: 15000 })})
                        .catch(console.error);
                        break;
                    }
                }

                let new_comp = '';
                for (let i = 0; i < 3; i++) {
                    new_comp = String(new_color[i*2]) + String(new_color[i*2+1]);
                    new_colors[i] = 16 * parseInt(new_comp[0], 16) + parseInt(new_comp[1], 16);
                }

                let colorEmbed = new Discord.MessageEmbed(UniversalEmbed)
                .setColor(parseInt(new_color, 16))
                .setTitle(`#${new_color.toUpperCase()}`)
                .setDescription("Representation of a color in different formats.")
                .addFields(
                    { name: "RGB - red, green, blue", value: `(${new_colors[0]}, ${new_colors[1]}, ${new_colors[2]})`},
                    { name: "Decimal - from 0 to 16777216", value: `${parseInt(new_color, 16)}`},
                    { name: "CMY - cyan, magenta, yellow", value: `(${((255-new_colors[0])/255).toFixed(4)}, ${((255-new_colors[1])/255).toFixed(4)}, ${((255-new_colors[2])/255).toFixed(4)})`},
                    { name: "XYZ - color wheel coordinates", value: `(${(new_colors[0]/255*100).toFixed(4)}, ${(255-new_colors[1]/255*100).toFixed(4)}, ${(255-new_colors[2]/255*100).toFixed(4)})`}
                )
                
                message.channel.send(colorEmbed)
                .catch(console.error);
                break;

            case 'rcolor':
                let hexcode = (Math.floor(Math.random() * 16777215)).toString(16);

                let colors = [0, 0, 0];
                let comp = '';
                for (let i = 0; i < 3; i++) {
                    comp = String(hexcode[i*2]) + String(hexcode[i*2+1]);
                    colors[i] = 16 * parseInt(comp[0], 16) + parseInt(comp[1], 16);
                }

                let rcolorEmbed = new Discord.MessageEmbed(UniversalEmbed)
                .setColor(parseInt(hexcode, 16))
                .setTitle(`#${hexcode.toUpperCase()}`)
                .setDescription("Representation of a color in different formats.")
                .addFields(
                    { name: "RGB - red, green, blue", value: `(${colors[0]}, ${colors[1]}, ${colors[2]})`},
                    { name: "Decimal - from 0 to 16777216", value: `${parseInt(hexcode, 16)}`},
                    { name: "CMY - cyan, magenta, yellow", value: `(${((255-colors[0])/255).toFixed(4)}, ${((255-colors[1])/255).toFixed(4)}, ${((255-colors[2])/255).toFixed(4)})`},
                    { name: "XYZ - color wheel coordinates", value: `(${(colors[0]/255*100).toFixed(4)}, ${(255-colors[1]/255*100).toFixed(4)}, ${(255-colors[2]/255*100).toFixed(4)})`}
                )

                message.channel.send(rcolorEmbed)
                .catch(console.error);
                break;

            case 'draw':
                let arc = false;
                if (String(args).length <= 0) {
                    message.channel.send("Invalid input. Use coordinates in the form (x,y).")
                    .then (msg => { msg.delete({timeout: 15000 })})
                    .catch(console.error);
                    break;
                }
                else if (String(args).indexOf('save') !== -1) {
                    let attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'canvas.png');
                    message.channel.send("", attachment);
                    break;
                }
                else if (String(args).indexOf('reset') !== -1) {

                    ctx.fillStyle = "#FFFFFF";
                    ctx.fillRect(0, 0, 1280, 1280);
                    ctx.fillStyle = color;

                    message.channel.send("Successfully reset canvas.")
                    .then (msg => { msg.delete({timeout: 15000 })})
                    .catch(console.error);
                    break;
                }

                else if (String(args).indexOf('random') !== -1) {

                    let c2 = String(message.content.split(message.content.indexOf("random")+1, message.content.length)).replace(/[^0-9]/gi, "");
                    if (c2 > 999) c2 = 999;
                    else if (c2 < 1) c2 = 1;

                    for (let i = 0; i < parseInt(c2); i++) {
                        let x = Math.floor(Math.random() * 1280);
                        let y = Math.floor(Math.random() * 1280);
                        let w = Math.floor(Math.random() * 1280);
                        let h = Math.floor(Math.random() * 1280);

                        ctx.fillStyle = `#${(Math.floor(Math.random() * 16777215)).toString(16)}`;
                        ctx.fillRect(Math.floor(Math.random() * 1280), Math.floor(Math.random() * 1280), Math.floor(Math.random() * 1280), Math.floor(Math.random() * 1280));
                        ctx.fillStyle = color;
                    }

                    let attachment2 = new Discord.MessageAttachment(canvas.toBuffer(), '../assets/discordjs.png');
                    let drawEmbed2 = new Discord.MessageEmbed(UniversalEmbed)
                    .setImage('attachment://discordjs.png')
                    .setTitle("Drawing canvas")
                    .setDescription("Server-wide drawing board.")
                    .addField("Usage", "**!draw (x,y,w,h)** - draws with the given position and size\n\n**!draw pen #000 (or #000000)** - specifies color");
                    message.channel.send({ files: [attachment2], embed: drawEmbed2 });
                    break;
                }
                else if (String(args).indexOf('pen') !== -1) {
                    let new_arg = String(args).replace(/ {1,9999}/gi, "");
                    new_arg = String(new_arg).replace(/,{1,9999}/g, "").match(/#[A-F|0-9]{3,6}/gi);

                    if (new_arg !== null) 
                        new_arg = new_arg[0];
                    else {
                        message.channel.send("Invalid input. Use a color value in the form #ABC or #ABCDEF.")
                        .then (msg => { msg.delete({timeout: 15000 })})
                        .catch(console.error);
                        break;
                    }
                    
                    if (new_arg.length != 4 && new_arg.length != 7) {
                        message.channel.send("Invalid input. Use a color value in the form #ABC or #ABCDEF.")
                        .then (msg => { msg.delete({timeout: 15000 })})
                        .catch(console.error);
                        break;
                    }
                    
                    color = new_arg.replace(/#[A-F|0-9][A-F|0-9][A-F|0-9][A-F|0-9][A-F|0-9][A-F|0-9]/gi, "");
                    color = new_arg.replace(color, "");
                    if (color === '') {
                        color = new_arg.replace(/ {1,9999}/gi, "").replace(/#[A-F|0-9][A-F|0-9][A-F|0-9]/gi, "");
                        color = new_arg.replace(color, "");
                        color = `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`;
                        if (color === '') {
                            message.channel.send("Invalid input. Use a color value in the form #ABC or #ABCDEF.")
                            .then (msg => { msg.delete({timeout: 15000 })})
                            .catch(console.error);
                            break;
                        } else {
                            message.channel.send(`Draw color changed to ${color}.`)
                            .then (msg => { msg.delete({timeout: 15000 })})
                            .catch(console.error);
                            break;
                        }
                    } else {
                        message.channel.send(`Draw color changed to ${color}.`)
                        .then (msg => { msg.delete({timeout: 15000 })})
                        .catch(console.error);
                        break;
                    }

                    break;
                }
                else if (String(args).indexOf('circle') !== -1) 
                    arc = true;

                ctx.fillStyle = color;

                let coord = String(args).replace(/[^0-9|.|,]/gi, "");
                let old_coords = String(coord).split(",");
                let coords = [];

                let increment = 0;
                for (let i = 0; i < old_coords.length; i++) {
                    if (old_coords[i] === '')
                        continue;
                    else {
                        coords[increment] = old_coords[i];
                        increment++;
                    }
                }

                for (let i = 0; i < coords.length; i++)
                    coords[i] = Math.max(0, Math.min(coords[i], 1280));

                if (!arc) {
                    if (coords.length === 2)
                        ctx.fillRect(parseInt(coords[0]),parseInt(coords[1]), 16, 16);
                    else if (coords.length === 4)
                        ctx.fillRect(parseInt(coords[0]),parseInt(coords[1]), parseInt(coords[2]), parseInt(coords[3]));
                    else {
                            message.channel.send("Invalid input. Use coordinates and size in the format (x,y,w,h).")
                            .then (msg => { msg.delete({timeout: 15000 })})
                            .catch(console.error);
                            break;
                    }
                }
                else if (arc) {
                    if (coords.length === 3) {
                        ctx.arc(parseInt(coords[0]),parseInt(coords[1]), parseInt(coords[2]), 0, 2*Math.PI);
                        ctx.fill();
                    }
                    else if (coords.length === 5) {
                        ctx.arc(parseInt(coords[0]),parseInt(coords[1]), parseInt(coords[2]), parseInt(coords[3]), parseInt(coords[4]));
                        ctx.fill();
                    }
                    else {
                            message.channel.send("Invalid input. Use coordinates and size in the format (x,y,r).")
                            .then (msg => { msg.delete({timeout: 15000 })})
                            .catch(console.error);
                            break;
                    }
                }

                let attachment = new Discord.MessageAttachment(canvas.toBuffer(), '../assets/discordjs.png');

                let drawEmbed = new Discord.MessageEmbed(UniversalEmbed)
                .setImage('attachment://discordjs.png')
                .setTitle("Drawing canvas")
                .setDescription("Server-wide drawing board.")
                .addField("Usage", "**!draw (x,y,w,h)** - draws with the given position and size\n\n**!draw pen #000 (or #000000)** - specifies color");
                message.channel.send({ files: [attachment], embed: drawEmbed });
                break;

            case 'echo':
                if (message.content.length > 6) {
                    let repeat = message.content.slice(6, message.content.length);

                    message.channel.send(repeat)
                    .catch(console.error);
                    break;
                }
                else {
                    message.channel.send(`Invalid input. Include a phrase for the bot to repeat.`)
                    .then (msg => { msg.delete({timeout: 15000 })})
                    .catch(console.error);
                    break;
                }

            case 'uptime':
                var up = client.uptime;
                var weeks = parseInt(up/1000/60/60/24/7);
                var days = parseInt((up-(weeks*7*24*60*60*1000))/1000/60/60/24);
                var hours = parseInt((up-((weeks*7*24*60*60*1000)+(days*24*60*60*1000)))/1000/60/60);
                var minutes = parseInt((up-((weeks*7*24*60*60*1000)+(days*24*60*60*1000)+(hours*60*60*1000)))/1000/60);
                var seconds = parseInt((up-((weeks*7*24*60*60*1000)+(days*24*60*60*1000)+(hours*60*60*1000)+(minutes*60*1000)))/1000);
                
                var uptimeEmbed = new Discord.MessageEmbed(UniversalEmbed)
                .setTitle("Specific uptime")
                .setDescription("View exactly how long the bot has been online.")
                .addFields(
                    { name: "Weeks", value: `${weeks}`, inline: true },
                    { name: "Days", value: `${days}`, inline: true },
                    { name: "Hours", value: `${hours}`, inline: true },
                    { name: "Minutes", value: `${minutes}`, inline: true },
                    { name: "Seconds", value: `${seconds}`, inline: true }
                );

                message.channel.send(uptimeEmbed);
                break;

            case 'prune':
                let count = parseInt(String(args).replace(/[^0-9]/g, ''));
                if (count > 100) count = 100;

                if (count > 0) {
                    message.channel.messages.fetch({ limit: count })
                        .then(messages => {
                            message.channel.bulkDelete(messages)
                            .catch(error => {
                                if (error.code !== Discord.Constants.APIErrors.UNKNOWN_MESSAGE)
                                    console.error("ERROR: Failed to delete message\n", error);
                            });
                            
                            let pruneEmbed = new Discord.MessageEmbed(UniversalEmbed)
                            .setTitle("Pruned")
                            .setDescription(`${messages.array().length} messages cleaned.`);

                            message.channel.send(pruneEmbed)
                            .then (msg => { 
                                msg.delete({timeout: 5000 })
                                .catch(error => {
                                    if (error.code !== Discord.Constants.APIErrors.UNKNOWN_MESSAGE)
                                        console.error("ERROR: Failed to delete message\n", error);
                                });
                            })
                            .catch(console.error);
                        })
                        .catch(console.error);
                }
                else 
                    message.channel.send("Invalid input.")
                    .then(msg => {
                        msg.delete({timeout: 5000})
                        .catch(error => {
                            if (error.code !== Discord.Constants.APIErrors.UNKNOWN_MESSAGE)
                                console.error("ERROR: Failed to delete message\n", error);
                        });
                    })
                    .catch(console.error);
                break;

            case 'clean':
                message.channel.messages.fetch()
                    .then(messages => {
                        let bot_messages = messages.filter(msg => msg.author === client.user);
                        message.channel.bulkDelete(bot_messages);

                        let cleanEmbed = new Discord.MessageEmbed(UniversalEmbed)
                        .setTitle("Pruned")
                        .setDescription(`${bot_messages.array().length} messages cleaned.`);
                        message.channel.send(cleanEmbed)
                        .then(msg => {
                            msg.delete({timeout: 5000})
                        })
                        .catch(console.error);
                    })
                    .catch(console.error);
                    break;

            case 'setnick':
                if (message.mentions.users.size !== 1 && !message.mentions.everyone) {
                    message.channel.send("Mention a user to change their nickname.")
                    .then(msg => {
                        msg.delete({timeout: 5000})
                    })
                    .catch(console.error);
                    break;
                }
                else {
                    if (!(message.mentions.size > 0) || !(String(args).length > 0)) {
                        message.channel.send(`Invalid input. Tag a user and present a nickname to modify it.`)
                        .then (msg => { msg.delete({timeout: 15000 })})
                        .catch(console.error);
                        break;
                    }
                    let user = message.mentions.users.first();
                    let old_nick = String(args).split(",");
                    let nick = [];

                    let increment = 0;
                    for (let i = 0; i < old_nick.length; i++) {
                        if (old_nick[i] === '')
                            continue;
                        else
                            nick[increment] = old_nick[i];
                    }
                    nick = nick[0];

                    if (nick === '') {
                        message.channel.send(`Please specify a nickname.`)
                        .then (msg => { msg.delete({timeout: 15000 })})
                        .catch(console.error);
                        break;
                    }
                    else if (nick.length > 32) {
                        message.channel.send(`WARNING: Nickname will be shortened to 32c.`)
                        .then (msg => { msg.delete({timeout: 15000 })})
                        .catch(console.error);
                        break;
                    }

                    message.guild.member(user).setNickname(nick)
                    .catch(guild => {
                        message.channel.send(`ERROR: Insufficient permissions.`)
                        .then (msg => { msg.delete({timeout: 15000 })})
                        .catch(console.error);
                    });
                    break;
                }

            case 'kick': 
            if (!(String(args).length > 0)) {
                message.channel.send(`Invalid input. Tag a user to kick them.`)
                .then (msg => { msg.delete({timeout: 15000 })})
                .catch(console.error);
                break;
            }
            let user = message.mentions.users.first();
            if (!user) {
                message.channel.send(`Invalid input. Tag a user to kick them.`)
                .then (msg => { msg.delete({timeout: 15000 })})
                .catch(console.error);
                break;
            }

            let member = message.guild.member(user);
            let reason = String(message.content).slice(String(message.content).indexOf(">") + 1, String(message.content).length);

            if (member) {
                if (reason === '') {
                    member
                    .kick()
                    .then (msg => {
                        message.channel.send(`User successfully kicked.`)
                        .then (msg => { msg.delete({timeout: 15000 })})
                        .catch(console.error);
                    })
                    .catch(guild => {
                        message.channel.send(`ERROR: Insufficient permissions.`)
                        .then (msg => { msg.delete({timeout: 15000 })})
                        .catch(console.error);
                    });
                }
                else {
                    member
                    .kick(reason)
                    .then (msg => {
                        message.channel.send(`User successfully kicked {reason: ${reason}}.`)
                        .then (msg => { msg.delete({timeout: 15000 })})
                        .catch(console.error);
                    })
                    .catch(guild => {
                        message.channel.send(`ERROR: Insufficient permissions.`)
                        .then (msg => { msg.delete({timeout: 15000 })})
                        .catch(console.error);
                    });
                }
                break;
            }
            else {
                message.channel.send(`Invalid input. Tag a user and present a nickname to modify it.`)
                .then (msg => { msg.delete({timeout: 15000 })})
                .catch(console.error);
                break;
            }

            case 'ban':
                let old_days = '', day_idx = -1;
                let save = false;

                if (String(args).indexOf('match') !== -1) {
                    let b = 0;
                    let match_text = String(message.content).slice(String(message.content).indexOf("match") + 6, String(message.content).length);
                    if (match_text[0] === ' ') match_text = match_text.slice(1, match_text.length);
                    
                    message.channel.messages.fetch()
                    .then(msg => {
                        for (let i = 0; i < msg.array().length; i++) {
                            if (i === msg.array().length - 1) {
                                message.channel.send(`Operation success. Members banned: \`${b}\``)
                                .then (msg => { msg.delete({timeout: 15000 })})
                                .catch(console.error);
                                break;
                            }
                            if (msg.array()[i].content.toLowerCase().indexOf(match_text.toLowerCase()) !== -1 && msg.array()[i].author !== message.author) {
                                console.log(`${msg.array()[i].author.username}`);

                                let us = message.guild.member(msg.array()[i].author);
                                if (!us.bannable) continue;

                                us
                                .ban({days: 7, reason: `Sent messages containing '${match_text}'.`})
                                .then(b++)
                                .catch(console.error);
                            }
                        }
                    })
                    .catch(a => {
                        message.channel.send(`ERROR: Failed to fetch messages.`)
                        .then (msg => { msg.delete({timeout: 15000 })})
                        .catch(console.error);
                    });
                    break;
                }

                if (!(String(args).length > 0)) {
                    message.channel.send(`Invalid input. Tag a user to ban them.`)
                    .then (msg => { msg.delete({timeout: 15000 })})
                    .catch(console.error);
                    break;
                }

                let old_user = message.mentions.users.first();
                if (!old_user) {
                    message.channel.send(`Invalid input. Tag a user to ban them.`)
                    .then (msg => { msg.delete({timeout: 15000 })})
                    .catch(console.error);
                    break;
                }

                if (String(message.content).indexOf('days') !== -1 && String(message.content).indexOf('days') < String(message.content).indexOf('<')) {
                    old_days = String(message.content).replace(`<@!${old_user.id}>`, "").replace(/[^0-9]/gi, "");
                    day_idx = String(message.content).indexOf(old_days);
                    if (old_days === '' || day_idx === -1) {
                        message.channel.send(`Invalid input. Please include a number of days.`)
                        .then (msg => { msg.delete({timeout: 15000 })})
                        .catch(console.error);
                        break;
                    }
                }
                else if (String(args).indexOf('save') !== -1)
                    save = true;
    
                let old_member = message.guild.member(old_user);

                let old_reason = '';
                if (day_idx === -1)
                    old_reason = String(message.content).replace(`<@!${old_user.id}>`, "").slice(String(message.content).indexOf(">") + 1, String(message.content).length).replace(/ {2,9999}/g, " ");
                else
                    old_reason = String(message.content).replace(`<@!${old_user.id}>`, "").slice(day_idx + 1, String(message.content).length).replace(/ {2,9999}/g, " ");

                if (old_reason[0] === ' ') old_reason = old_reason.slice(1, old_reason.length);

                if (old_member) {
                    if (save) old_days = 0;
                        old_member
                        .ban( { days: parseInt(old_days), reason: old_reason})
                        .then (msg => {
                            let ms;
                            if (old_reason === '' && old_days === '')
                                ms = message.channel.send(`User successfully banned; no messages removed.`);
                            else if (old_reason !== '' && old_days === '')
                                ms = message.channel.send(`User successfully banned {reason: ${old_reason}}; no messages removed.`);
                            else if (old_reason === '' && old_days !== '')
                                ms = message.channel.send(`User successfully banned; ${old_days} days of messages removed.`);
                            else if (old_reason !== '' && old_days !== '')
                                ms = message.channel.send(`User successfully banned {reason: ${old_reason}}; ${old_days} days of messages removed.`);
                            else 
                                ms = message.channel.send(`User successfully banned.`);

                            ms
                            .then (msg => { msg.delete({timeout: 15000 })})
                            .catch(console.error);
                        })
                        .catch(guild => {
                            message.channel.send(`ERROR: Insufficient permissions.`)
                            .then (msg => { msg.delete({timeout: 15000 })})
                            .catch(console.error);
                        });
                        break;
                }
                else {
                    message.channel.send(`Invalid input. Tag a user and present a nickname to modify it.`)
                    .then (msg => { msg.delete({timeout: 15000 })})
                    .catch(console.error);
                    break;
                }

            default:
                break;
        }
    }
});

client.login('NzAzODUyODE0MDU2NTU0NTI2.XqUo_w.kyY0o5V8ZDRdX2wSDjAhXHwXfww');