require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const students = require('./students.json')

const app = express();

const {
    SESSION_SECRET,
    DOMAIN,
    CLIENT_ID,
    CLIENT_SECRET,
    CALLBACK_URL
} = process.env;

app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new Auth0Strategy({
    domain: DOMAIN,
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    callbackURL: CALLBACK_URL,
    scope: 'openid email profile'
}, (accessToken, refreshToken, extraParams, profile, done) => {
    done(null, profile)
}))

passport.serializeUser((user, done) => {
    done(null, { clientID: user.id, email: user._json.email, name: user._json.name })
})
passport.deserializeUser((obj, done) => {
    done(null, obj)
})

app.get('/login',
    passport.authenticate('auth0',
        { successRedirect: 'http://localhost:3001', failureRedirect: '/login', connection: 'github'}
    )
)
app.get('/auth/logout', (req, res) => {
    req.logOut();
    return res.redirect(`https://${DOMAIN}/v2/logout?returnTo=http://localhost:3001`);
  })

const authenticated = (req, res, next) => {
    if(req.user) {
        next();
    }
    else {
        res.status(401).send();
    }
}
app.get('/students', authenticated, function(req, res) {
    res.status(200).send(students)
})

const port = 3000;
app.listen(port, () => { console.log(`Server listening on port ${port}`); });