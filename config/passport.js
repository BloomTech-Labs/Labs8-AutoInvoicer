const passport = require("passport");
const Auth0Strategy = require("passport-auth0");
const cookieParser = require("cookie-parser");
const session = require("express-session");

require("dotenv").config();



const strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL:
      process.env.AUTH0_CALLBACK_URL || "http://localhost:8000/callback"
  },
  function(accessToken, refreshToken, extraParams, profile, done) {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    return done(null, profile);
  }
);

const sess = {
  secret: process.env.SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: true
};

module.exports = server => {
  if (server.get("env") === "production") {
    sess.cookie.secure = true; // serve secure cookies, requires https
  }

  server.use(cookieParser());
  server.use(session(sess));
  passport.use(strategy);
  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });
  server.use(passport.initialize());
  server.use(passport.session());
};