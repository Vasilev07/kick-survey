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

        const users = [];
        const emails = [];

        await data.users.getAllUsernames().map(async (userData) => {
            await users.push(userData.username);
        });
        await data.users.getAllEmails().map(async (userData) => {
            await emails.push(userData.email);
        });
        try {
            await userController.validateUsername(users, currentUsername);
            await userController.validateUserEmail(emails, currentUserMail);
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
