/* globals Map, Set */

const Crypto = require('./cryptography-controller');
const lodash = require('lodash');
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
        let surveys;
        try {
            surveys = await this.data.surveys.getUserSurveys(user.id);
        } catch (err) {
            surveys = [];
        }

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

            let questions;
            try {
                questions =
                    await this.data.questions.getSurveyQuestions(survey.id);
            } catch (err) {
                questions = [];
            }

            let questionResult;
            try {
                questionResult = await this._extractQuestions(questions);
            } catch (err) {
                questionResult = [];
            }

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

    async getAllUsersCategories() {
        const users = await this.data.users.getAll();
        const allUsersRes = users.map(async (user) => {
            const surveys = await this.data.surveys.getUserSurveys(user.id);
            const allUsersSurv = surveys.map(async (survey) => {
                const allSurveyCatId = [];
                allSurveyCatId.push(survey.cat_id);
                allSurveyCatId.sort();
                const allSurveyIdResult = allSurveyCatId
                    .map(async (survCat) => {
                        const categoryObj = await this.data.categories
                            .getById(survCat);
                        const categoryName = categoryObj.name;
                        return categoryName;
                    });
                const allSurveyIdData = await Promise.all(allSurveyIdResult);
                return allSurveyIdData;
            });
            const allSurvRes = await Promise.all(allUsersSurv);
            return allSurvRes;
        });
        let finalData = await Promise.all(allUsersRes);

        finalData = lodash.flattenDeep(finalData);

        const mapOfCategories = new Map([...new Set(finalData)]
            .map((x) => [x, finalData.filter((y) => y === x).length]));

        const label = [];
        const data = [];

        mapOfCategories.forEach((value, key, map) => {
            label.push(key);
            data.push(value);
        });

        return {
            label,
            data,
        };
    }

    async getAllUsersTypes() {
        const questionInfo = await this.data.questions.getAll();
        const questionTypeIdArray = [];
        questionInfo.map((questionTypeId) => {
            questionTypeIdArray.push(questionTypeId.type_id);
        });
        const res = questionTypeIdArray.map(async (id) => {
            const questionType = [];
            const typeId = await this.data.types.getById(id);
            await questionType.push(typeId.q_type);
            return questionType;
        });
        let result = await Promise.all(res);
        result = lodash.flattenDeep(result);
        const mapOfCategories = new Map([...new Set(result)]
            .map((x) => [x, result.filter((y) => y === x).length]));

        const label = [];
        const data = [];
        mapOfCategories.forEach((value, key, map) => {
            label.push(key);
            data.push(value);
        });
        return {
            label,
            data,
        };
    }

    getAllCategories() {
        return this.data.categories.getAll();
    }
    getAllQuestionTypes() {
        return this.data.types.getAll();
    }
}

module.exports = DataController;
