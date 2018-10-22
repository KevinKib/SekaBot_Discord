const Role = function(_name) {

    let publics = this, privates = {};

    privates.name = _name;
    privates.userList = [];
    privates.deletable = true;

    publics.name = function(_name) {
        if (typeof _name != "undefined") {
            privates.name = _name;
        }
        else {
            return privates.name;
        }
    }

    publics.deletable = function(bool) {
        if (typeof bool != "undefined") {
            privates.deletable = bool;
        }
        else {
            return privates.deletable;
        }
    }

    publics.userList = function(list) {
        if (typeof list != "undefined") {
            privates.userList = list;
        }
        else {
            return privates.userList;
        }
    };

    publics.addUser = function(userId) {
        privates.userList.push(userId);
    }

    publics.removeUser = function(userId) {
        privates.userList.splice(userId);
    }

    publics.checkUser = function(userId) {
        return privates.userList.includes(userId);
    }

};

module.exports.Role = Role;