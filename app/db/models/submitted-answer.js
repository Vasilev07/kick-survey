'use strict';
module.exports = (sequelize, DataTypes) => {
    const SubmittedAnswer = sequelize.define('SubmittedAnswer', {
        submit_identifier: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        survey_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        question_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        answer_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        answer: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    }, {});
    SubmittedAnswer.associate = (models) => {
        // associations can be defined here
        const {
            Answer,
            Question,
            Survey,
        } = models;
        SubmittedAnswer.belongsTo(Survey, {
            foreignKey: 'survey_id',
            onDelete: 'CASCADE',
        });
        SubmittedAnswer.belongsTo(Question, {
            foreignKey: 'question_id',
            onDelete: 'CASCADE',
        });
        SubmittedAnswer.belongsTo(Answer, {
            foreignKey: 'answer_id',
            onDelete: 'CASCADE',
        });
    };
    return SubmittedAnswer;
};
