/* globals __dirname*/

const {
    Router,
} = require('express');
const path = require('path');
const DataController = require('../controllers/data-controller');
const SubmitController = require('../controllers/submit-controller');
const init = (app, data) => {
    const router = new Router();

    // for some reason the render searched for a 'views' dir inside 'app'
    app.set('views', path.join(__dirname, '../../views'));

    const controller = new DataController(data);

    router
        .get('/', async (req, res) => {
            const statistickData = await controller.getAllUsersCategories();
            const context = {
                isAuthenticated: req.isAuthenticated(),
                label: statistickData.label,
                data: statistickData.data,
            };

            res.render('shared-views/master', context);
        })
        .get('/index', async (req, res) => {
            if (!req.isAuthenticated()) {
                return res.redirect('/');
            }

            const model = await controller.getUserSurveysData(req.user);
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

            const categories = await controller.getAllCategories();
            const questionTypes = await controller.getAllQuestionTypes();

            const model = {
                categories,
                questionTypes,
            };

            return res.render('create-survey/page', model);
        })
        .get('/api/:url', async (req, res) => {
            const param = req.params.url;
            const surveyData = await controller.getUserSurveyData(param);
            res.send(surveyData);
        })
        .get('/preview/:url', async (req, res, next) => {
            const param = req.params.url;
            console.log(param);

            res.render('preview-survey/preview', {});
        })
        .post('/api/statistics', async (req, res) => {
            try {
                const statistickData = await controller.getAllUsersCategories();
                const statisticDataSecond = await controller.getAllUsersTypes();
                const context = {
                    labelPie: statistickData.label,
                    dataPie: statistickData.data,
                    labelDonut: statisticDataSecond.label,
                    dataDonut: statisticDataSecond.data,
                };
                res.status(200).send(context);
            } catch (error) {
                res.status(500).end();
            }
            console.log(await controller.getAllUsersTypes());
        })
        .post('/submit', async (req, res) => {
            const body = req.body;

            const submitController = new SubmitController(data);
            console.log(submitController.createSubmit(body));

            res.send(body);
        });

    app.use('/', router);
};

module.exports = {
    init,
};
