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
      User,
      Category,
    } = models;
    Survey.belongsTo(User, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE',
    });
    Survey.belongsTo(Category, {
      foreignKey: 'cat_id',
      onDelete: 'CASCADE',
    });
  };
  return Survey;
};
