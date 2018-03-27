'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * addColumn "user_id" to table "SubmittedAnswers"
 *
 **/

var info = {
    "revision": 2,
    "name": "noname",
    "created": "2018-03-26T15:11:18.795Z",
    "comment": ""
};

var migrationCommands = [{
    fn: "addColumn",
    params: [
        "SubmittedAnswers",
        "user_id",
        {
            "type": Sequelize.INTEGER,
            "onUpdate": "CASCADE",
            "onDelete": "CASCADE",
            "references": {
                "model": "Users",
                "key": "id"
            },
            "allowNull": false
        }
    ]
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
