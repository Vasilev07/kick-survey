/* globals __dirname*/

const {
    Router,
} = require('express');
const path = require('path');

const DataController = require('../controllers/data-controller');
const SubmitController = require('../controllers/submit-controller');
const SurveyController = require('../controllers/survey-controller');
const CryptographyController =
    require('../controllers/cryptography-controller');

const init = (app, data) => {
    const router = new Router();

    app.set('views', path.join(__dirname, '../../views'));

    const dataController = new DataController(data);

    router
        .post('/create', async (req, res) => {
            const surveyData = req.body;
            surveyData.user = req.user;

            const surveyController = new SurveyController(data);
            try {
                await surveyController.createSurvey(surveyData);
            } catch (err) {
                console.log(err);
            }

            return res.status(200).json(req.body);
        })
        .delete('/delete-survey', async (req, res) => {
            try {
                await dataController.deleteSurvey(req.body.survey);
                res.sendStatus(200);
            } catch (err) {
                console.log(err);
                res.status(500).json(err);
            }
        })
        .get('/:url', async (req, res) => {
            const param = req.params.url;

            try {
                const surveyData =
                    await dataController.getUserSurveyData(param);
                res.send(surveyData);
            } catch (err) {
                res.status(500).json(err);
            }
        })
        .get('/analyze/:url', async (req, res) => {
            const url = req.params.url;
            const surveyData = await dataController.getSubmittedData(url);
            res.status(200).send(surveyData);
        })
        .post('/user-surveys', async (req, res) => {
            const user = req.user;
            let cat = null;
            let surveys;

            if (req.body.category) {
                cat = req.body.category;
            }

            try {
                surveys = await dataController.getUserSurveysData(user, cat);
                res.status(200).send(surveys);
            } catch (err) {
                res.status(500).send(surveys);
            }
        })
        .post('/statistics', async (req, res) => {
            try {
                const statisticsPie =
                    await dataController.getAllUsersCategories();
                const statisticsDataDonut =
                    await dataController.getAllUsersTypes();
                const statisticsDataBarByDate =
                    await dataController.getAllSubmissionsByDate();
                const statisticsDataBarByDay =
                    await dataController.getAllSubmissionsByDayOfWeek();
                const context = {
                    labelPie: statisticsPie.label,
                    dataPie: statisticsPie.data,
                    labelDonut: statisticsDataDonut.label,
                    dataDonut: statisticsDataDonut.data,
                    labelBar: statisticsDataBarByDate.label,
                    dataBar: statisticsDataBarByDate.data,
                    dataBarDay: statisticsDataBarByDay.label,
                    labelBarDay: statisticsDataBarByDay.data,
                };
                res.status(200).send(context);
            } catch (error) {
                res.status(500).end();
            }
        })
        .post('/get-user', (req, res) => {
            const user = {
                username: req.user.username,
                id: req.user.id,
            };

            return res.status(200).send(user);
        })
        .post('/submit', async (req, res) => {
            const body = req.body;

            const submitController = new SubmitController(data);
            try {
                await submitController.createSubmit(body);
            } catch (err) {
                console.log(err);
            }

            res.send(body);
        })
        .post('/generate-share', async (req, res) => {
            const body = req.body;

            const controller = new CryptographyController();
            const encryptedUrl =
                controller.encrypt(req.user.id, body.surveyName);
            const finalUrl = req.protocol + '://' +
                req.get('host') + '/preview/' + encryptedUrl;

            res.status(200).json(finalUrl);
        })
        .post('/check-survey-name', async (req, res) => {
            const userId = req.body.userId;
            const surveyName = req.body.surveyName;
            let checkUniqueSurveyName;
            try {
                checkUniqueSurveyName = await
                dataController.checkIfSurveyNameExist(surveyName, userId);
            } catch (err) {
                throw err;
            }

            res.send(checkUniqueSurveyName);
        });

    app.use('/api', router);
};

module.exports = {
    init,
};
