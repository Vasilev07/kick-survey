'use strict';
module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define('Question', {
    survey_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_required: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  }, {});
  Question.associate = (models) => {
    // associations can be defined here
    const {
      Answer,
    } = models;
    Answer.belongsTo(Question, {
      foreignKey: 'q_id',
      onDelete: 'CASCADE',
    });
  };
  return Question;
};
