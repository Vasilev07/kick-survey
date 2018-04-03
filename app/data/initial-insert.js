const {
    Category,
    Type,
} = require('../db/models');

const {
    data,
} = require('./predefined');

const populateData = async () => {
    console.log(1)
    data.types.map(async (type) => {
        await Type.create(type);
    });
    data.categories.map(async (category) => {
        await Category.create(category);
    });
};

populateData();
