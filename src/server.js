const express = require('express');
const path = require('path'); // permitirnos manejar mas facilmente las rutas de las vistas
const exphbs = require('express-handlebars'); // extension de javascript para manejo de vista html
const methover = require('method-override'); // incluye metodos put y delete en formularios
const expsess = require('express-session'); //autenticar usuario con credenciales de manera temporal
const flash = require('connect-flash'); // intercambio de informacion entre vistas
const passport = require('passport');

// Initializing
const app = express();
require('./db');
require('./config/passport');

// Settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}))
app.set('view engine', '.hbs');

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(methover('_method'));
app.use(expsess({
    secret: 'admin',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Global Variables
app.use((req, res, next) => {
    res.locals.sucmsg = req.flash('sucmsg');
    res.locals.errmsg = req.flash('errmsg')
    res.locals.error = req.flash('error')
    next();
})

// Routes
app.use(require('./routes/index'));
app.use(require('./routes/notes'));
app.use(require('./routes/users'));

// Static Files
app.use(express.static(path.join(__dirname, 'public')));

// Server hosting
app.listen(app.get('port'), () => {
    console.log('Server running on port', app.get('port'));
});