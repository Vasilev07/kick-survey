const Crypto = require('./cryptography-controller');

class DataController {
    constructor(data) {
        this.data = data;
    }
    /**
     * @description Iterates through the user's object and
     * retrieves his surveys, the surveys' questions and answers
     * @param {Object} user
     * @async
     * @return {Promise<Object>} The collected data
     */
    async getUserSurveysData(user) {
        const surveys = await this.data.surveys.getUserSurveys(user.id);

        const surveysResults = surveys.map(async (survey) => {
            const surveyData = {
                surveyData: {
                    id: survey.id,
                    name: survey.name,
                    category: survey.Category.name,
                    createdAt: survey.createdAt,
                },
                surveyContentData: [],
            };

            const questions =
                await this.data.questions.getSurveyQuestions(survey.id);
            const questionResult = await this._extractQuestions(questions);

            surveyData.surveyContentData.push(...questionResult);

            return surveyData;
        });

        const surveysData = await Promise.all(surveysResults);

        return surveysData;
    }
    /**
     * @description Gets only one survey based on a url. Extracts userId and
     * survey name from the encrypted url.
     * @param {string} url
     * @async
     * @return {Promise<Object>} The collected data
     */
    async getUserSurveyData(url) {
        const cryptography = new Crypto();
        const decrypt = cryptography.decrypt(url);

        const userId = decrypt.match(/^(\d+)/)[0];
        const name = decrypt.slice(userId.length + 2);

        const survey = await this.data.surveys.getSurvey(userId, name);
        const questions =
            await this.data.questions.getSurveyQuestions(survey.id);

        survey.dataValues.surveyContentData = [];

        const questionResult = await this._extractQuestions(questions);

        survey.dataValues.surveyContentData.push(...questionResult);

        return survey;
    }

    /**
     * @description Extract questions info and includes the answers
     * per each question
     * @param {Object[]} questions
     * @async
     * @return {Promise<Object>} Questions and answers
     */
    async _extractQuestions(questions) {
        const questionData = questions.map(async (question) => {
            const questionDataObj = {
                questionData: {
                    questionId: question.id,
                    question: question.name,
                    order: question.order,
                    isRequired: question.is_required,
                    type: question.Type.q_type,
                },
                answersData: [],
            };

            const answersResults = await this._extractAnswers(question);

            questionDataObj.answersData.push(...answersResults);
            return questionDataObj;
        });

        const questionResult = await Promise.all(questionData);
        return questionResult;
    }

    /**
     * @description Extract answers info
     * @param {Object[]} question
     * @async
     * @return {Promise<Object>} All answers for the given question
     */
    async _extractAnswers(question) {
        const answers =
            await this.data.answers.getQuestionAnswers(question.id);

        const answersResults = answers.map((answer) => {
            return {
                answerId: answer.id,
                answer: answer.answer_name,
            };
        });

        return answersResults;
    }

    getAllCategories() {
        return this.data.categories.getAll();
    }

    getAllQuestionTypes() {
        return this.data.types.getAll();
    }
}

module.exports = DataController;
