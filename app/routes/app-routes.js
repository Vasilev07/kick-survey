/* globals __dirname*/

const {
    Router,
} = require('express');
const path = require('path');

const DataController = require('../controllers/data-controller');

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
                user: req.user,
                label: statisticsData.label,
                data: statisticsData.data,
            };

            res.render('shared-views/master', context);
        })
        .get('/index', async (req, res) => {
            let categories = [];
            if (!req.isAuthenticated()) {
                return res.redirect('/');
            }

            try {
                categories = await dataController.getAllCategories();
            } catch (err) {
                categories = [];
            }

            return res.render('index', {
                isAuthenticated: req.isAuthenticated(),
                user: req.user,
                categories,
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
                isAuthenticated: req.isAuthenticated(),
                user: req.user,
            };
            return res.render('create-survey/create-survey-master', model);
        })
        .get('/preview/:url', async (req, res, next) => {
            res.render('preview-survey/preview', {
                isAuthenticated: req.isAuthenticated(),
                user: req.user,
            });
        })
        .get('/analyze/:url', async (req, res) => {
            res.render('preview-survey/statistics', {
                isAuthenticated: req.isAuthenticated(),
                user: req.user,
            });
        });
    app.use('/', router);
};

module.exports = {
    init,
};
