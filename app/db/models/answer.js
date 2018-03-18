'use strict';
module.exports = (sequelize, DataTypes) => {
  const Answer = sequelize.define('Answer', {
    q_id: {
      type: DataTypes.INTEGER,
    },
    answer_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {});
  Answer.associate = (models) => {
    const {
      Question,
    } = models;
    Answer.belongsTo(Question, {
      foreignKey: 'q_id',
      onDelete: 'CASCADE',
    });
  };
  return Answer;
};
