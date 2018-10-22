const Discord = require('discord.js');
const Role = require('../role/role.js');


// Commands default class
const Command = function (_title, _msg) {

    const CommandManager = require('./commandmanager').CommandManager;
    
    var publics = this, privates = {};
    
    CommandManager.getInstance().increaseNbCommands();

    // ATTRIBUTES

    privates.title = _title;
    privates.message = _msg;
    privates.description = "";
    privates.deletable = false;
    privates.permission = [];

    // PROPERTIES

    publics.title = function (newTitle) {
        if (typeof newTitle !== "undefined") {
            // Setter
            privates.title = newTitle;
        }
        else {
            // Getter
            return privates.title;
        }
    };

    publics.message = function (newMessage) {
        if (typeof newMessage !== "undefined") {
            privates.message = newMessage;
        }
        else {
            return privates.message;
        }
    };

    publics.description = function (newDescription) {
        if (typeof newDescription !== "undefined") {
            privates.description = newDescription;
        }
        else {
            return privates.description;
        }
    };

    publics.deletable = function (newDeletable) {
        if (typeof newDeletable !== "undefined") {
            privates.deletable = newDeletable;
        }
        else {
            return privates.deletable;
        }
    };

    publics.permission = function() {
        return privates.permission;
    }

    publics.addPermission = function(role) {
        privates.permission.push(role);
    };

    publics.removePermission = function(role) {
        privates.permission.splice(role);
    };

    publics.checkPermission = function(message) {
        
        authorized = false;

        // We should use a while that stops itself when the condition is reached, in theory
        privates.permission.forEach(function(role) {
            if (role.checkUser() === true) {
                authorized = true;
            }
        });

        if (message.author.username === "Sekanor") {
            authorized = true;
        }

        return authorized;

    };


    // Abstract (empty) function
    publics.execute = function (args, message) {};
    publics.type = function() {};

};


// Commands created by the bot maker
const BotCommand = function (title) {
    Command.call(this, title, "");
    
    this.type = function() {
        return 'BotCommand';
    }
    this.deletable(false);
};


// Commands created by users that only display text
const UserCommand = function (title, msg) {
    Command.call(this, title, msg);
    let publics = this, privates = {};

    this.type = function() {
        return 'UserCommand';
    }
    this.deletable(true);
    this.execute = function(args, message) {
        message.channel.send(publics.message());
    };
    
};


module.exports.Command = Command;
module.exports.BotCommand = BotCommand;
module.exports.UserCommand = UserCommand;