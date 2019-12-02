const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');

const User = require('../models/user');

passport.use(new LocalStrategy({
    usernameField: 'email'
}, async (email, password, done) => {
    // Match Email's User
    const user = await User.findOne({ email: email });
    if (!user) {
        return done(null, false, { message: 'User not found.' });
    } else {
        // Match Password's User
        const match = await user.match(password);
        if (match) {
            return done(null, user);
        } else {
            return done(null, false, { message: 'the password is incorrect' });
        }
    }

}));

// maintain the user id in the session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// gets the user by the id and thus allows us to get user information from session id
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});
