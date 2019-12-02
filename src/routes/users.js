const express = require('express');
const router = express.Router();
const passport = require('passport');

const user = require('../models/user');

router.get('/users/signup', (req, res) => {
    res.render('users/signup');
});

router.post('/users/signup', async (req, res) => {
    const { name, email, password, confirm_password } = req.body;
    const errors = [];

    if (name.length <= 0) {
        errors.push({ text: 'The name field must not be empty' });
    }

    if (email.length <= 0) {
        errors.push({ text: 'The email field must not be empty' });
    }

    if (password != confirm_password) {
        errors.push({ text: 'Passwords are not matching' });
    }

    if (password.length < 4) {
        errors.push({ text: 'Password must be at least 8 characters' });
    }

    if (errors.length > 0) {
        res.render('users/signup', {
            errors,
            name,
            email,
            password,
            confirm_password
        });
    } else {
        const testEmail = await user.findOne({ email: email });

        if (testEmail) {
            req.flash('errmsg', 'There is already an account signed with that email');
            res.redirect('/users/signup');
        }

        const newUser = new user({ name, email, password });
        newUser.password = await newUser.encrypt(password);
        await newUser.save();
        req.flash('sucmsg', 'You have successfully SIGNED UP with us');
        res.redirect('/users/login');
    }
});

router.get('/users/login', (req, res) => {
    res.render('users/login');
});

router.post('/users/login', passport.authenticate('local', {
    successRedirect: '/notes',
    failureRedirect: '/users/login',
    failureFlash: true
}));

router.get('/users/logout', (req, res) => {
    req.logout();
    res.redirect('/');
})

module.exports = router;