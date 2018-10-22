const Discord = require('discord.js');

//const config = require('./config.json');
const {prefix, token} = require('./config.json');
const client = new Discord.Client();

const CommandManager = require('./source/command/commandmanager').CommandManager;
const RoleManager = require('./source/role/rolemanager').RoleManager;

// Instantiate default commands
CommandManager.getInstance().createDefaultCommands();
CommandManager.getInstance().loadCommandsFromFile();
RoleManager.getInstance().createDefaultRoles();


client.on('ready', () => {
    console.log('Ready!');
});

client.on('message', message => {
    CommandManager.getInstance().interpretMessage(message);
});

client.on('messageDelete', message => {
    //message.channel.send("mdr ça delete le message : "+message);
});


client.login(token);