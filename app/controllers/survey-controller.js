class SurveyController {
    constructor(data) {
        this.data = data;
    }
    /**
     * @description Stores in the db the information
     * about the given survey
     * @param {Object} surveyData
     * @async
     */
    async createSurvey(surveyData) {
        let category;
        let createdSurvey;
        try {
            category = await this.data.
            categories.getByCategoryName(surveyData.category);
        } catch (err) {
            throw err;
        }

        const createSurveyObj = {
            name: surveyData.surveyName,
            user_id: surveyData.user.id,
            cat_id: category.id,
        };

        try {
            createdSurvey = await this.data.surveys.create(createSurveyObj);
        } catch (err) {
            throw err;
        }

        try {
            await this._createQuestion(surveyData.questionData, createdSurvey);
        } catch (err) {
            throw err;
        }
    }

    async _createQuestion(questionData, createdSurvey) {
        questionData.map(async (survey, index) => {
            let type;
            let createdQuestion;

            try {
                type =
                    await this.data.types.getByTypeName(survey.questionType);
            } catch (err) {
                throw err;
            }

            const questionObj = {
                survey_id: createdSurvey.id,
                order: index,
                name: survey.question,
                is_required: survey.isRequired,
                type_id: type.id,
            };

            try {
                createdQuestion =
                    await this.data.questions.create(questionObj);
            } catch (err) {
                throw err;
            }

            try {
                await this._createAnswer(survey.answers, createdQuestion);
            } catch (err) {
                throw err;
            }
        });
    }

    async _createAnswer(answerData, createdQuestion) {
        if (answerData instanceof Array) {
            answerData.map(async (answer) => {
                const answerObj = {
                    q_id: createdQuestion.id,
                    answer_name: answer,
                };
                try {
                    await this.data.answers.create(answerObj);
                } catch (err) {
                    throw err;
                }
            });
        } else {
            const answerObj = {
                q_id: createdQuestion.id,
                answer_name: '',
            };
            try {
                await this.data.answers.create(answerObj);
            } catch (err) {
                throw err;
            }
        }
    }
}

module.exports = SurveyController;
