const Data = require('./data-generic');
const {
    Type,
} = require('../db/models');

class TypeData extends Data {
    constructor() {
        super(Type);
    }

    async getByTypeName(type) {
        return this.Model.findOne({
            where: {
                q_type: type,
            },
        });
    }
}

module.exports = {
    TypeData,
};
