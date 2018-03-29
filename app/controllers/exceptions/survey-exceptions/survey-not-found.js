const SurveyError = require('./survey-error');

class SurveyNotFound extends SurveyError {
    constructor() {
        super('Survey not found', 40);
    }
}

module.exports = SurveyNotFound;
