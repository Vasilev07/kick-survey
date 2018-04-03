const passport = require('passport');

const init = (app, data) => {
    app.post('/login', (req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.status(300).json(info);
            }
            return req.login(user, (error) => {
                if (error) {
                    return res.status(300).json(info);
                }

                return res.redirect('/index');
            });
        })(req, res, next);
    });

    app.get('/logout', (req, res) => {
        req.logout();
        console.log(req.isAuthenticated());
        res.redirect('/');
    });
};

module.exports = {
    init,
};
