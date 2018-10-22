const Role = require("./role.js").Role;
const RoleManager = require("./rolemanager.js").RoleManager;

const Role_Admin = function() {
    Role.call(this, "Admin");
    this.deletable(false);
};

const Role_User = function() {
    Role.call(this, "User");
    this.deletable(false);
};


module.exports.Role_Admin = Role_Admin;
module.exports.Role_User = Role_User;