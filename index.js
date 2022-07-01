const express = require('express');
const expressSession = require('express-session');
const path = require('path');
const app = express();
const User = require('User');
require('dotenv').config({path: path.join(__dirname, '.env')});
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

// API_ID = process.env.APP_ID;
// API_SECRET = process.env.APP_SECRET;
PORT = process.env.PORT || 3000;

// console.log(API_ID);

app.use(express.static('public'));
// app.set("view engine", "ejs");

app.use(passport.initialize());
app.use(expressSession({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

passport.use(new FacebookStrategy({
    clientID: process.env.APP_ID,
    clientSecret: process.env.APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((id, done) => {
    return done(null, user);
});

app.get('/auth/facebook',
  passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/callback');
  });

//   app.get("/login", function(req, res) {
//     res.render("login");
//   })

app.get('/', (req, res) => {
    res.render('index');
});


app.listen(PORT, () => `Server started on port ${PORT}`);