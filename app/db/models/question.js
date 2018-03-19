'use strict';
module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define('Question', {
    survey_id: {
      type: DataTypes.INTEGER,
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
      Type,
      Survey,
    } = models;
    Question.belongsTo(Survey, {
      foreignKey: 'survey_id',
      onDelete: 'CASCADE',
    });
    Question.belongsTo(Type, {
      foreignKey: 'type_id',
      onDelete: 'CASCADE',
    });
  };
  return Question;
};
