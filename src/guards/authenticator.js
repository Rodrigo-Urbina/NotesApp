const guards = {};

guards.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('errmsg', 'Not Authorized.');
    res.redirect('/users/login');
};

module.exports = guards;
