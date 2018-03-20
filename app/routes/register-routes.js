const {
    User,
} = require('../db/models');

const init = (app, data) => {
    app.get('/register', (req, res) => {
        res.render('auth/register');
    });

    app.post('/register', async (req, res) => {
        const userModel = req.body;
        if (userModel['new-password'] !== userModel['re-password']) {
            return new Error('passwords does not match');
        }

        const user = {
            username: userModel.username,
            password: userModel['new-password'],
            first_name: userModel.first_name,
            last_name: userModel.last_name,
            email: userModel['e-mail'],
        };
        
        await User.create(user);
        res.redirect('/');
    });
};

module.exports = {
    init,
};
