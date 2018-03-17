'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * removeColumn "category_id" from table "Surveys"
 *
 **/

var info = {
    "revision": 3,
    "name": "removed-category-id",
    "created": "2018-03-17T16:28:17.157Z",
    "comment": ""
};

var migrationCommands = [{
    fn: "removeColumn",
    params: ["Surveys", "category_id"]
}];

module.exports = {
    pos: 0,
    up: function(queryInterface, Sequelize)
    {
        var index = this.pos;
        return new Promise(function(resolve, reject) {
            function next() {
                if (index < migrationCommands.length)
                {
                    let command = migrationCommands[index];
                    console.log("[#"+index+"] execute: " + command.fn);
                    index++;
                    queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                }
                else
                    resolve();
            }
            next();
        });
    },
    info: info
};
