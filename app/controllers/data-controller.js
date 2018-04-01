/* globals Map, Set */
const SurveyError = require('./exceptions/survey-exceptions');
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
     * @param {string} cat Surveys' category
     * @async
     * @return {Promise<Object>} The collected data
     */
    async getUserSurveysData(user, cat = null) {
        let surveys;

        // in order to return all the surveys
        if (cat === 'All') {
            cat = null;
        }

        const cryptography = new Crypto();
        try {
            surveys = await this.data.surveys.getUserSurveys(user.id, cat);
        } catch (err) {
            surveys = [];
        }

        const surveysResults = surveys.map(async (survey) => {
            let count = 0;

            try {
                count = await this.data
                        .submittedAnswer.countUniqueSubmits(user.id, survey.id);
            } catch (err) {
                console.log(err);
            }

            const surveyData = {
                surveyData: {
                    id: survey.id,
                    name: survey.name,
                    encryptedUrl: cryptography.encrypt(user.id, survey.name),
                    category: survey.Category.name,
                    createdAt: survey.createdAt,
                    uniqueSubmits: count,
                },
                surveyContentData: [],
            };

            const questions =
                await this.data.questions.getSurveyQuestions(survey.id);

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
        let decrypt;

        try {
            decrypt = cryptography.decrypt(url);
        } catch (err) {
            throw new SurveyError.SurveyNotFound();
        }

        const userId = decrypt.match(/^(\d+)/)[0];
        const name = decrypt.slice(userId.length + 2);

        const survey = await this.data.surveys.getSurvey(userId, name);

        if (!survey) {
            throw new SurveyError.SurveyNotFound();
        }

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

    async getAllSubmitionsByDate() {
        const formatDates = (submitionDate) => {
            let day = submitionDate.getDate();
            let month = submitionDate.getMonth() + 1;
            const year = submitionDate.getFullYear();
            if (day < 10) {
                day = '0' + day;
            }
            if (month < 10) {
                month = '0' + month;
            }
            submitionDate = day + '/' + month + '/' + year;

            return submitionDate;
        };

        const submisions = await this.data.submittedAnswer.getUniqueSubmitions();
        const daysOfSub = [];
        submisions.map((sub) => {
            const uniqueDates = sub.DISTINCT;
            daysOfSub.push(formatDates(uniqueDates));
        });
        const mapOfDays = new Map([...new Set(daysOfSub)]
            .map((x) => [x, daysOfSub.filter((y) => y === x).length]));
        let label = [];
        const data = [];

        mapOfDays.forEach((value, key, map) => {
            label.push(key);
            data.push(value);
        });
        label = label.slice(label.length - 7, 7);
        return {
            label,
            data,
        };
    }

    async getAllSubmitionsByDayOfWeek() {
        const days = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const submisions = await this.data.submittedAnswer.getUniqueSubmitions();
        const daysOfSub = [];
        const daysOfSubWithWord = [];
        submisions.map((sub) => {
            const dayAsDigit = (sub.DISTINCT.getDay());
            daysOfSub.push(dayAsDigit + 1);
        });
        daysOfSub.sort();
        daysOfSub.map((el) => {
            daysOfSubWithWord.push(days[el]);
        });
        const mapOfDays = new Map([...new Set(daysOfSubWithWord)]
            .map((x) => [x, daysOfSubWithWord.filter((y) => y === x).length]));

        const label = [];
        const data = [];
        mapOfDays.forEach((value, key, map) => {
            label.push(key);
            data.push(value);
        });

        return {
            label,
            data,
        };
    }

    async deleteSurvey(url) {
        const cryptography = new Crypto();
        let decrypt;

        try {
            decrypt = cryptography.decrypt(url);
        } catch (err) {
            throw new SurveyError.SurveyNotFound();
        }

        const userId = decrypt.match(/^(\d+)/)[0];
        const name = decrypt.slice(userId.length + 2);

        try {
            const res = await this.data.surveys.deleteSurvey(userId, name);
            return res;
        } catch (err) {
            throw err;
        }
    }

    getAllCategories() {
        return this.data.categories.getAll();
    }
    getAllQuestionTypes() {
        return this.data.types.getAll();
    }
}

module.exports = DataController;
