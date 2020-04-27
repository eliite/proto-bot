'use strict';

const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log('I am ready!');
  client.user.setPresence({ activity: { name: 'with motivation' }, status: 'online' })
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
    [ "Configuration", "Prefix", "change the prefix of commands"],
    [ "Fun", "Reverse", "reverse a word or phrase"],
    [ "Fun", "RPS", "play rock, paper, scissors"],
    [ "Fun", "Flip", "flip a coin" ],
    [ "Fun", "RColor", "preview a generated color"],
    [ "Moderation", "Uptime", "view how long the bot has been online"],
    [ "Moderation", "Prune", "bulk delete messages younger than 14 days"],
    [ "Moderation", "Clean", "clean all bot messages"]
];

var prefix = '!';
client.on('message', message => {
    if (message.content.startsWith(String(prefix), 0) && !message.author.bot) {
        const args = message.content.slice(String(prefix).length).split(' ');
        const command = args.shift().toLowerCase();

        switch (String(command)) {
            case 'help':

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
                helpEmbed //
                .setTitle('Command list')
                .setDescription('A list and description of every functioning command.');

                message.channel.send(helpEmbed);
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
               
            case 'rcolor':
                let hexcode = (Math.floor(Math.random() * 16777215)).toString(16);

                let color = [0, 0, 0];
                let comp = '';
                for (let i = 0; i < 3; i++) {
                    comp = String(hexcode[i*2]) + String(hexcode[i*2+1]);
                    color[i] = 16 * parseInt(comp[0], 16) + parseInt(comp[1], 16);
                }

                let rcolorEmbed = new Discord.MessageEmbed(UniversalEmbed)
                .setColor(parseInt(hexcode, 16))
                .setTitle(`#${hexcode.toUpperCase()}`)
                .setDescription("Representation of a color in different formats.")
                .addFields(
                    { name: "RGB - red, green, blue", value: `(${color[0]}, ${color[1]}, ${color[2]})`},
                    { name: "Decimal - from 0 to 16777216", value: `${parseInt(hexcode, 16)}`},
                    { name: "CMY - cyan, magenta, yellow", value: `(${((255-color[0])/255).toFixed(4)}, ${((255-color[1])/255).toFixed(4)}, ${((255-color[2])/255).toFixed(4)})`},
                    { name: "XYZ - color wheel coordinates", value: `(${(color[0]/255*100).toFixed(4)}, ${(255-color[1]/255*100).toFixed(4)}, ${(255-color[2]/255*100).toFixed(4)})`}
                )

                message.channel.send(rcolorEmbed);
                break;

            case 'uptime':
                var up = client.uptime;
                var weeks = parseInt(up/1000/60/60/24/7);
                var days = parseInt((up-(weeks*7*24*60*60*1000))/1000/60/60/24);
                var hours = parseInt((up-(days*24*60*60*1000))/1000/60/60);
                var minutes = parseInt((up-(hours*60*60*1000))/1000/60);
                var seconds = parseInt((up-(minutes*60*1000))/1000);
                
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
                            message.channel.bulkDelete(messages);
                            
                            let pruneEmbed = new Discord.MessageEmbed(UniversalEmbed)
                            .setTitle("Pruned")
                            .setDescription(`${messages.array().length} messages cleaned.`);
                            message.channel.send(pruneEmbed)
                            .then (msg => { msg.delete({timeout: 5000 })})
                            .catch(console.error);
                        })
                        .catch(console.error);
                }
                else 
                    message.channel.send("Invalid input.")
                    .then(msg => {
                        msg.delete({timeout: 5000})
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
            default:
                break;
        }
    }
});

client.login('NzAzODUyODE0MDU2NTU0NTI2.XqUo_w.kyY0o5V8ZDRdX2wSDjAhXHwXfww');