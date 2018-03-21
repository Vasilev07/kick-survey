const {
    User,
} = require('../db/models');

const init = (app, data) => {
    app.get('/register', (req, res) => {
        const model = {};
        if (app.locals.existUserError) {
            model.existUserError = app.locals.existUserError;
        } else {
            app.locals.existUserError = null;
        }

        res.render('auth/register', model);
        app.locals.existUserError = null;
    });

    app.post('/validate', async (req, res) => {
        const userModel = req.body;
        const users = [];
        await data.users.getAllUsernames().map(async (user) => {
            await users.push(user.username);
        });
        console.log(users);
        res.status(200).json(userModel).end();
    });

    app.post('/', async (req, res) => {
        const userModel = req.body;
        console.log('/ route');
        console.log(req.body);
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
        try {
            // await User.create(user);
            app.locals.existUserError = {
                status: false,
                username: null,
            };
            // res.redirect('/');
        } catch (error) {
            console.log(error);
            app.locals.existUserError = {
                status: true,
                username: user.username,
            };
            // res.redirect('/');
        }
    });
};

module.exports = {
    init,
};
