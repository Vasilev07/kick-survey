'use strict';
module.exports = (sequelize, DataTypes) => {
  const Answer = sequelize.define('Answer', {
    q_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    answer_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {});
  Answer.associate = (models) => {
    // associations can be defined here
  };
  return Answer;
};
