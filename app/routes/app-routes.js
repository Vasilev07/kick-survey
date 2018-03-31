/* globals __dirname*/

const {
    Router,
} = require('express');
const path = require('path');

const DataController = require('../controllers/data-controller');
const SubmitController = require('../controllers/submit-controller');
const CryptographyController =
    require('../controllers/cryptography-controller');

const init = (app, data) => {
    const router = new Router();

    // for some reason the render searched for a 'views' dir inside 'app'
    app.set('views', path.join(__dirname, '../../views'));

    const dataController = new DataController(data);

    router
        .get('/', async (req, res) => {
            const statisticsData = await dataController.getAllUsersCategories();
            const context = {
                isAuthenticated: req.isAuthenticated(),
                label: statisticsData.label,
                data: statisticsData.data,
            };

            res.render('shared-views/master', context);
        })
        .get('/test', (req, res) => {
            res.render('test-form', {});
        })
        .get('/index', async (req, res) => {
            if (!req.isAuthenticated()) {
                return res.redirect('/');
            }

            return res.render('index', {
                isAuthenticated: req.isAuthenticated(),
            });
        })
        .get('/create', async (req, res) => {
            if (!req.isAuthenticated()) {
                return res.redirect('/');
            }
            const categories = await dataController.getAllCategories();
            const questionTypes = await dataController.getAllQuestionTypes();
            const model = {
                categories,
                questionTypes,
            };
            return res.render('create-survey/page', model);
        })
        .get('/api/:url', async (req, res) => {
            const param = req.params.url;

            try {
                const surveyData =
                    await dataController.getUserSurveyData(param);
                res.send(surveyData);
            } catch (err) {
                res.status(500).json(err);
            }
        })
        .get('/preview/:url', async (req, res, next) => {
            res.render('preview-survey/preview', {});
        })
        .get('/statistics/:url', async (req, res) => {
            res.render('preview-survey/statistics', {});
        })
        .get('/api/statistics/:url', async (req, res) => {
            const url = req.params.url;
            const surveyData = await dataController.getUserSurveyData(url);
            res.status(200).send(surveyData);
        })
        .post('/api/user-surveys', async (req, res) => {
            const user = req.user;

            const model = await dataController.getUserSurveysData(req.user);
            console.log(model);
            res.status(200).send(model);
        })
        .post('/api/statistics', async (req, res) => {
            try {
                const statisticsPie =
                    await dataController.getAllUsersCategories();
                const statisticsDataDonut =
                    await dataController.getAllUsersTypes();
                const statisticsDataBarByDate =
                    await dataController.getAllSubmitionsByDate();
                const statistiDataBarByDay =
                    await dataController.getAllSubmitionsByDayOfWeek();
                const context = {
                    labelPie: statisticsPie.label,
                    dataPie: statisticsPie.data,
                    labelDonut: statisticsDataDonut.label,
                    dataDonut: statisticsDataDonut.data,
                    labelBar: statisticsDataBarByDate.label,
                    dataBar: statisticsDataBarByDate.data,
                    dataBarDay: statistiDataBarByDay.label,
                    labelBarDay: statistiDataBarByDay.data,
                };
                res.status(200).send(context);
            } catch (error) {
                res.status(500).end();
            }
        })
        .post('/get-user', (req, res) => {
            if (!req.isAuthenticated()) {
                return res.status(500).send('Could not get user');
            }
            const user = {
                username: req.user.username,
                id: req.user.id,
            };

            return res.status(200).send(user);
        })
        .post('/submit', async (req, res) => {
            const body = req.body;
            console.log(body);
            const submitController = new SubmitController(data);
            console.log(submitController.createSubmit(body));

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
        });

    app.use('/', router);
};

module.exports = {
    init,
};
