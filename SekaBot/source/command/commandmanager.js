// Imports
const Command = require('./command').Command;
const UserCommand = require('./command').UserCommand;
const BotCommand = require('./command').BotCommand;


const {prefix, token} = require('../../config.json');

// Manages all the commands [CHECK SINGLETON http://tassedecafe.org/fr/implementer-design-pattern-singleton-javascript-1023]
const CommandManager = (function() {

    let constructor = function() {

        let publics = this, privates = {};

        privates.list = [];
        privates.nbCommands = 0;


        publics.increaseNbCommands = function() {
            privates.nbCommands++;
        };


        publics.decreaseNbCommands = function() {
            privates.nbCommands--;
        }


        publics.list = function() {
            // Getter
            return privates.list;
        };

        
        publics.createDefaultCommands = function() {
            
            const Commands = require('./defaultcommands');
            privates.list.push(new Commands.BotCommand_Help());
            privates.list.push(new Commands.BotCommand_Command());
            privates.list.push(new Commands.BotCommand_Role());
            
            
            // Refers to the command that was just instantiated
            /*
            var command;

            command = new UserCommand("info", "SekaBot v1.0.\n" +
                "Created by Sekanor.\n" +
                "Written in JavaScript.\n" +
                "Latest release : 01/10/2018");
            command.deletable(false);
            privates.list.push(command);


            command = new UserCommand("ping", "Pong.");
            privates.list.push(command);
            */

        };

        
        publics.getCommand = function(_title) {
            let res;

            Command.list.forEach(function(command) {
                if (command.title() === _title) {
                    res = command;
                }
            });

            if (typeof res === 'undefined') throw "No function found.";

            return res;
        };

        
        publics.checkArguments = function(args, amount, errorMessage) {
            let realErrorMessage = "Invalid syntax. \n"+errorMessage;
            
            let i;
            for(i = 0; i<=amount; i++) {
                if (typeof args[i] === 'undefined') throw realErrorMessage;
                if (args[i] === '') throw realErrorMessage;
            }
        };

        
        publics.addSubFunction = function(command, keyword) {};

        

        publics.interpretMessage = function(message) {
            if (!message.content.startsWith(prefix) || message.author.bot) return;

            const args = message.content.slice(prefix.length).split(/ +/);
            const title = args.shift().toLowerCase();

            try {
                privates.list.forEach(function(command) {
                    if (title === command.title()) {
                        if (command.checkPermission(message) === true) {
                            command.execute(args, message);
                        }
                        else {
                            message.channel.send("You do not have the permission to execute this command.");
                        }
                    }
                });
            }
            catch(error) {
                message.channel.send('An unexpected error happened : \n'+error);
            }
        };
        

        publics.updateSaveFile = function() {

            let saveList = [];
            
            privates.list.forEach(function(command) {
                if (command.type() === 'UserCommand') {

                    let UserCommand_Serializable = {
                        title       : command.title(),
                        message     : command.message(),
                        description : command.description(),
                        deletable   : command.deletable(),
                        permission  : command.permission()
                    }

                    saveList.push(UserCommand_Serializable);
                    
                }
            });
            let save = JSON.stringify(saveList, null, ' ');
            
            const fs = require('fs');
            fs.writeFile("save/commands.json", save, (err) => {
                if (err) {
                    throw err;
                }
                else {
                    console.log("Command saved !");
                }
                
            });
        };


        publics.loadCommandsFromFile = function() {

            let load;

            const fs = require('fs');
            load = fs.readFileSync("save/commands.json");

            let loadList = JSON.parse(load);
            
            loadList.forEach(function(command) {

                var newCommand = new UserCommand(command.title, command.message);
                newCommand.description(command.description);
                newCommand.deletable(command.deletable);
                newCommand.permission(command.permission);

                privates.list.push(newCommand);

            });
            
        };
        
    };

    let publics = this, privates = {};
    privates.instance = null;
    privates.createInstance = function() {
        return new constructor();
    };

    return {
        getInstance: function() {
            if (!privates.instance) {
                privates.instance = privates.createInstance();
            }
            return privates.instance;
        }
    };

})();


module.exports.CommandManager = CommandManager;