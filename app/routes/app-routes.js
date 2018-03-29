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

            const model = await dataController.getUserSurveysData(req.user);
            // return res.send(model);
            return res.render('index', {
                isAuthenticated: req.isAuthenticated(),
                username: req.user.username,
                email: req.user.email,
                name: req.user.first_name + ' ' + req.user.last_name,
                model,
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
            const surveyData = await dataController.getUserSurveyData(param);
            res.send(surveyData);
        })
        .get('/preview/:url', async (req, res, next) => {
            const param = req.params.url;
            console.log(param);

            res.render('preview-survey/preview', {});
        })
        .post('/api/statistics', async (req, res) => {
            try {
                const statisticsData =
                    await dataController.getAllUsersCategories();
                const statisticDataSecond =
                    await dataController.getAllUsersTypes();
                const context = {
                    labelPie: statisticsData.label,
                    dataPie: statisticsData.data,
                    labelDonut: statisticDataSecond.label,
                    dataDonut: statisticDataSecond.data,
                };
                res.status(200).send(context);
            } catch (error) {
                res.status(500).end();
            }
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