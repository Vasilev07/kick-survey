const Data = require('./data-generic');
const {
    Category,
} = require('../db/models');

class CategoryData extends Data {
    constructor() {
        super(Category);
    }

    async getByCategoryName(catName) {
        return this.Model.findOne({
            where: {
                name: catName,
            },
        });
    }
}

module.exports = {
    CategoryData,
};
