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
  };
  return Category;
};
