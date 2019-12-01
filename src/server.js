const express = require('express');
const path = require('path'); // permitirnos manejar mas facilmente las rutas de las vistas
const exphbs = require('express-handlebars'); 
const methover = require('method-override'); // incluye metodos put y delete en formularios
const expsess = require('express-session'); //autenticar usuario con credenciales de manera temporal

// Initializing
const app = express();
require('./db');

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
}))
// Global Variables


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