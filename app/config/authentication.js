const config = require('../config');

const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const Strategy = require('passport-local').Strategy;

const init = (app, data) => {
    passport.use(new Strategy(async (username, password, done) => {
        const user = await data.users.findByUsername(username);

        if (!user) {
            return done(null, false, {
                message: 'Incorrect username',
            });
        }

        if (user.password !== password) {
            return done(null, false, {
                message: 'Incorrect password',
            });
        }

        return done(null, user);
    }));

    passport.serializeUser((user, done) => {
        done(null, user.username);
    });

    passport.deserializeUser(async (username, done) => {
        let user;
        try {
            user = await data.users.findByUsername(username);

            if (!user) {
                return done(new Error('Invalid user'));
            }

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    });

    app.use(cookieParser());
    app.use(session({
        secret: config.secret,
    }));
    app.use(passport.initialize());
    app.use(passport.session());
};

module.exports = {
    init,
};
