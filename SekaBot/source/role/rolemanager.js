const Role = require("./role.js").Role;

const RoleManager = (function() {

    let constructor = function() {
        
        let publics = this, privates = {};

        privates.list = [];

        publics.createDefaultRoles = function() {
            const Roles = require("./defaultroles");

            publics.addRole(new Roles.Role_Admin());
            publics.addRole(new Roles.Role_User());
        };

        publics.addRole = function(name) {
            let unique = true;

            privates.list.forEach(function(role) {
                if (role.name() === name) {
                    unique = false;
                }
            });

            if (unique === true) {
                // Command succesfully pushed
                privates.list.push(new Role(name));
                publics.saveFile();
            }

            return unique;
        };

        publics.removeRole = function(name) {
            let deleted = false;

            privates.list.forEach(function(role) {
                if (role.name() === name) {
                    privates.list.splice(role);
                    deleted = true;
                    publics.saveFile();
                }
            });

            return deleted;
        };

        publics.saveFile = function() {
            let saveList = [];

            privates.list.forEach(function(role) {
                let Role_Serializable = {
                    name      : role.name(),
                    userList  : role.userList(),
                    deletable : role.deletable()
                };

                saveList.push(Role_Serializable);
            });

            let save = JSON.stringify(saveList, null, ' ');

            const fs = require('fs');
            fs.writeFileSync("save/roles.json", save);
            
            
        };

        publics.loadFromFile = function() {
            const fs = require('fs');

            let load = fs.readFileSync('save/roles.json');

            let loadList = JSON.parse(load);

            loadList.forEach(function(role) {

                var newRole = new Role(role.name);
                newRole.userList(role.userList);
                newRole.deletable(role.deletable);

                privates.list.push(newRole);

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

module.exports.RoleManager = RoleManager;