'use strict';
module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {});
  Category.associate = (models) => {
    // associations can be defined here
    const {
      Survey,
    } = models;
    Survey.belongsTo(Category, {
      foreignKey: 'cat_id',
      onDelete: 'CASCADE',
    });
  };
  return Category;
};
