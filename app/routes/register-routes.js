const UserController = require('../controllers/user-controller');

const init = (app, data) => {
    const userController = new UserController(data);

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

        const userObject = {
            username: userModel.username,
            email: userModel.email,
            firstName: userModel.firstName,
            lastName: userModel.lastName,
            password: userModel.password,
            rePassword: userModel.rePassword,
        };

        try {
            await userController.createUser(userObject);
            res.status(200).json(userObject);
        } catch (err) {
            console.log(err);
            res.status(400).json(err);
        }
    });
};

module.exports = {
    init,
};
