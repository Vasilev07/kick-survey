const UserController = require('../controllers/user-controller');
const passport = require('passport');

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

    app.post('/validate', async (req, res, next) => {
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
            const user = await userController.createUser(userObject);
            passport.authenticate('local', (err, user, info) => {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    return res.redirect('/');
                }
                req.logIn(user, (error) => {
                    if (error) {
                        return next(error);
                    }
                    return res.status(200).redirect('/index');
                });
            })(req, res, next);
        } catch (err) {
            console.log(err);
            res.status(400).json(err);
        }
    }, passport.authenticate('local', {
        successRedirect: '/index',
    }));
};

module.exports = {
    init,
};
