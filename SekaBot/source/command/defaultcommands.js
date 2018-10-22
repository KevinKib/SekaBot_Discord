const Command = require('./command').Command;
const UserCommand = require('./command').UserCommand;
const BotCommand = require('./command').BotCommand;
const CommandManager = require('./commandmanager').CommandManager;
const Role = require('../role/role').Role;
const RoleManager = require('../role/rolemanager').RoleManager;



const BotCommand_Help = function() {
    BotCommand.call(this, "help");

    var publics = this, privates = {};

    publics.execute = function(args, message){
        let msg = "";
        let list = CommandManager.getInstance().list();

        list.forEach(function(command) {
            msg += "!"+command.title();
            if (list.indexOf(command) !== list.length - 1) {
                msg += ", ";
            }
            else {
                msg += ".";
            }
        });
        message.channel.send(msg);
    };
};

const BotCommand_Command = function() {
    BotCommand.call(this, "command");
    
    let publics = this, privates = {};
    
    publics.execute = function(args, message) {
        let list = CommandManager.getInstance().list();
        

        if (args[0] === 'set') {
            CommandManager.getInstance().checkArguments(args, 1, "!command set <commandName> <message>" );

            // Define variables
            let title = args[1];

            let msg = "";
            for (let i = 2; i < args.length; i++) {
                msg += args[i];
                if (i !== args.length - 1) {
                    msg += ' ';
                }
            }

            // Instantiate new command
            list.forEach(function(command) {
                if (title === command.title()) {
                    if (command.deletable() === true) {
                        list.splice(list.indexOf(command), 1);
                    }
                    else {
                        throw ('This command cannot be overwritten!');
                    }
                }
            });

            // Display chat message
            list.push(new UserCommand(title, msg));
            message.channel.send('Command !'+title+' succesfully created!');
        }
        else if (args[0] === 'delete') {
            CommandManager.getInstance().checkArguments(args, 1, "!command delete <commandName>" );

            let title = args[1];
            let commandFound = false;

            list.forEach(function(element) {
                if (title === element.title()) {
                    if (element.deletable() === true) {
                        list.splice(list.indexOf(element), 1);
                        commandFound = true;
                    }
                    else {
                        throw ('This command cannot be deleted !');
                    }
                }
            });

            if (commandFound) {
                message.channel.send('Command !'+title+' deleted.');
            }
            else {
                message.channel.send('Command !'+title+' was not found.');
            }

        }
        else {
            throw 'Valid syntax : \n!command [set|delete]';
        }

        CommandManager.getInstance().updateSaveFile();
        
    };    
}

const BotCommand_Role = function() {
    BotCommand.call(this, "role");

    let publics = this, privates = {};

    publics.execute = function(args, message) {

        if (args[0] === "set") {
            // !role set <name>
            CommandManager.getInstance().checkArguments(args, 1, "!role set <name>" );

            let name = args[1];

            let done = RoleManager.getInstance().addRole(name);

            if (done === true) {
                message.channel.send("Role "+name+" succesfully created!")
            }
            else {
                throw "There is already a role with the same name.";
            }

        }
        else if (args[0] === "delete") {
            // !role delete [name]
            CommandManager.getInstance().checkArguments(args, 1, "!role delete <name>" );

            let name = args[1];

            let done = RoleManager.getInstance().removeRole(name);

            if (done === true) {
                message.channel.send("Role "+name+" succesfully deleted.")
            }
            else {
                throw "No role found.";
            }
        }
        else {
            // !role edit [name] addUser [username]
            // !role user add <role> <username>
            // !role user remove <role> <username>
            // !role edit [name] removeUser [username]
             
        };

    };
}


// Exports
module.exports.BotCommand_Help = BotCommand_Help;
module.exports.BotCommand_Command = BotCommand_Command;
module.exports.BotCommand_Role = BotCommand_Role;