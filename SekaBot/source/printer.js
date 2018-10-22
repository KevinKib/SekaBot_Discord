// Interface for printers
const Printer = function() {
    let publics = this, privates = {};

    publics.print = function(msg) {
        throw "Abstract function";
    };
};


// Printer that sends discord messages
const PrinterDiscord = function() {
    Printer.call(this);
    let publics = this, privates = {};

    publics.print = function(msg) {
        message.channel.send(msg);
    }
};


// Printer that sends console messages
const PrinterConsole = function() {
    Printer.call(this);
    let publics = this, privates = {};
    
    publics.print = function(msg) {
        console.log(msg);
    }
};