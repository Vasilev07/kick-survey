const {
    User,
} = require('../db/models');
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
        const currentUserMail = userModel.email;
        const currentUsername = userModel.username;
        const currentUserPassword = userModel.password;
        const currentUserRePassword = userModel.rePassword;

        try {
            await userController.validateUsername(currentUsername);
            await userController.validateUserEmail(currentUserMail);
            await userController.validatePasswords(currentUserPassword, currentUserRePassword);
        } catch (error) {
            console.log('--------------- INFO ----------------');
            console.log(error);
        }
        res.status(200).json(userModel).end();
    });
};

module.exports = {
    init,
};
