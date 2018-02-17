const express = require('express');
const path = require('path');
const session = require('express-session');
const cp = require('cookie-parser');
const bp = require('body-parser');
const passport = require('./Auth/passport.js');
const register = require('./routes/register.js');
const flash = require('connect-flash')
const app = express();


const login = require('./Auth/login');
const getDatabase = require('./routes/getDatabase');
const postDatabase = require('./routes/postDatabase');
const logout = require('./Auth/logout');
const google = require('./Auth/google');
const routes = require('./Auth/index');
const forgot = require('./Auth/forgot');
const reset = require('./Auth/reset');

app.use(cp('somerandomcharactersthatnooneknowslikechimichonga'));

app.use(session({
    secret: 'somerandomcharactersthatnooneknowslikechimichonga',
    resave: false,
    saveUnitialized: true
}));

app.use(bp.urlencoded({extended: true}));
app.use(bp.json());

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('/register',register);

app.use(express.static(path.join(__dirname,"public")));

app.use('/',routes);

app.use('/login',login);
app.use('/auth/google',google);
app.use('/logout',logout);

app.use('/forgot',forgot);


app.use('/reset',reset);


app.use('/getdatabase',getDatabase);
app.use('/postdatabase',postDatabase);

app.listen(3000);


