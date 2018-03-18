'use strict';
module.exports = (sequelize, DataTypes) => {
  const Survey = sequelize.define('Survey', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {});
  Survey.associate = (models) => {
    const {
      Question,
    } = models;
    Question.belongsTo(Survey, {
      foreignKey: 'survey_id',
      onDelete: 'CASCADE',
    });
  };
  return Survey;
};
