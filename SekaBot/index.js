const Discord = require('discord.js');

//const config = require('./config.json');
const {prefix, token} = require('./config.json');
const client = new Discord.Client();


Command.list = [];
function Command(_title, _msg) {
    var that = this;

    // Variable definitions
    this.title = {
        titleI: "",
        get() {
            return that.titleI;
        },
        set(newTitle) {
            that.titleI = newTitle;
        }
    };
    this.message = {
        messageI: "",
        get() {
            return that.messageI;
        },
        set(newMessage) {
            that.messageI = newMessage;
        }
    };
    this.description = {
        descriptionI: "",
        get() {
            return that.descriptionI;
        },
        set(description) {
            that.descriptionI = description;
        }
    }

    // Abstract (empty) function
    this.execute = function(args, message){};

    // Default values
    this.title.set(_title);
    this.message.set(_msg);

    Command.list.push(this);

    /* OLD METHODS

    -- UGLY METHOD
    this.title = _title;
    this.message = _msg;
    this.description = "";

    -- JAVA METHOD
    var title;
    var message;
    this.getTitle = function() {return title;}
    this.setTitle = function(_title) {title = _title;}
    this.getMessage = function() {return message;}
    this.setMessage = function(_message) {message = _message;}

    -- JAVASCRIPT LINKS
    // https://www.hongkiat.com/blog/getters-setters-javascript/
    // https://javascriptplayground.com/es5-getters-setters/
    // https://crockford.com/javascript/private.html
    // https://stackoverflow.com/questions/6799103/how-to-set-javascript-private-variables-in-constructor
    // https://developer.mozilla.org/fr/docs/Web/JavaScript/H%C3%A9ritage_et_cha%C3%AEne_de_prototypes
    */

}


function BotCommand(title) {
    // Inheritance
    Command.call(this, title, "");

    this.execute = function(args, message){};
}
Object.setPrototypeOf(BotCommand, Command);


function UserCommand(title, msg) {
    // Inheritance
    Command.call(this, title, msg);

    this.execute = function(args, message) {
        message.channel.send(this.message.get());
    }
}
Object.setPrototypeOf(UserCommand, Command);



// Instantiate default commands
new BotCommand("help").execute = function(args, message){
    let msg = "";
    Command.list.forEach(function(element) {
        msg += "!"+element.title.get();
        if (Command.list.indexOf(element) !== Command.list.length - 1) {
            msg += ", ";
        }
        else {
            msg += ".";
        }
    });
    message.channel.send(msg);
}

new BotCommand("command").execute = function(args, message) {

    if (args[0] === 'set') {
        // If the two first arguments aren't filled out, throw an exception.
        if (typeof args[1] === 'undefined' || typeof args[2] === 'undefined') throw "Arguments are invalid.";
        if (args[1] === "" || args[2] === "") throw "Arguments are invalid.";

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
        Command.list.forEach(function(element) {
            if (title === element.title.get()) {
                Command.list.splice(Command.list.indexOf(element), 1);
            }
        });
        new UserCommand(title, msg);

        // Display chat message
        message.channel.send('Command !'+title+' created !');
    }
    else {
        message.channel.send('Valid syntax : \n!command set [title] [message]');
    }

}

new UserCommand("ping", "Pong.");

new UserCommand("info", "SekaBot v1.0.\nCreated by Sekanor.\nWritten in JavaScript.\nLatest release : 09/09/2018");



client.on('ready', () => {
    console.log('Ready!');
});

client.on('message', message => {
    //console.log(message.content);

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    try {
        Command.list.forEach(function(element) {
            if (command === element.title.get()) {
                element.execute(args, message);
            }
        });
    }
    catch(error) {
        message.channel.send('An unexpected error happened : \n'+error);
    }

})

client.login(token);