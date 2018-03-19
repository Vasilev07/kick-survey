/* globals __dirname*/

const {
    Router,
} = require('express');
const path = require('path');

const init = (app, data) => {
    const router = new Router();

    // for some reason the render searched for a 'views' dir inside 'app'
    app.set('views', path.join(__dirname, '../../views'));

    router
        .get('/', (req, res) => {
            res.render('home', {});
        })
        .get('/index', (req, res) => {
            if (!req.isAuthenticated()) {
                return res.redirect('/login');
            }
            const model = {
                username: req.user.username,
                firstname: req.user.first_name,
                lastname: req.user.last_name,
                email: req.user.email,
            };
            return res.render('index', model);
        });

    app.use('/', router);
};

module.exports = {
    init,
};
