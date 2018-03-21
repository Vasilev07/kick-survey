const Data = require('./data-generic');
const {
    Survey,
    Category,
} = require('../db/models');

class SurveyData extends Data {
    constructor() {
        super(Survey);
    }

    async getUserSurveys(userId) {
        return await this.Model.findAll({
            where: {
                user_id: userId,
            },
            include: [Category],
        });
    }
}

module.exports = {
    SurveyData,
};
