'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * removeColumn "q_type" from table "Questions"
 *
 **/

var info = {
    "revision": 2,
    "name": "removed-q-type",
    "created": "2018-03-17T16:25:53.382Z",
    "comment": ""
};

var migrationCommands = [{
    fn: "removeColumn",
    params: ["Questions", "q_type"]
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
