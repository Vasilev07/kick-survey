/* globals __dirname*/

const {
    Router,
} = require('express');
const path = require('path');
const DataController = require('../data/data-controller');
const init = (app, data) => {
    const router = new Router();

    // for some reason the render searched for a 'views' dir inside 'app'
    app.set('views', path.join(__dirname, '../../views'));

    const controller = new DataController(data);

    router
        .get('/', (req, res) => {
            res.render('home', {});
        })
        .get('/index', async (req, res) => {
            if (!req.isAuthenticated()) {
                return res.redirect('/login');
            }

            console.log('-'.repeat(10));
            console.log(await controller.getByUser(req.user));
            console.log('-'.repeat(10));

            const userSurveys = await data.surveys.getUserSurveys(req.user.id);

            const model = {
                username: req.user.username,
                firstname: req.user.first_name,
                lastname: req.user.last_name,
                email: req.user.email,
                userSurveys,
            };

            model.userSurveys.map((sur) => {
                console.log(sur.Category);
            });

            return res.render('index', model);
        });

    app.use('/', router);
};

module.exports = {
    init,
};
