/* globals __dirname __filename*/

const fs = require('fs');
const path = require('path');

const init = (app, data) => {
    app.get('/', async (req, res) => {
        res.redirect('/');
    });
};
