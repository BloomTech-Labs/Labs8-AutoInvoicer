const express = require("express");
const path = require("path");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var dotenv = require("dotenv");
var passport = require("passport");
var Auth0Strategy = require("passport-auth0");
var flash = require("connect-flash");
var userInViews = require("./lib/middleware/userInViews");
var authRouter = require("./routes/auth");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

const connectMongo = require("./config/mongo");
const routeConfig = require("./config/routes");
dotenv.load();

const moduleConfig = require("./config/modules");
const serveClient = require("./config/serveClient");

// Configure Passport to use Auth0
var strategy = new Auth0Strategy(
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

passport.use(strategy);

// You can use this section to keep a smaller payload
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

const server = express();

connectMongo(server);
// View engine setup
server.set("views", path.join(__dirname, "views"));
server.set("view engine", "pug");

server.use(logger("dev"));
server.use(cookieParser());

// config express-session
var sess = {
  secret: "secretsecretsaresecrets",
  cookie: {},
  resave: false,
  saveUninitialized: true
};

if (server.get("env") === "production") {
  sess.cookie.secure = true; // serve secure cookies, requires https
}

server.use(session(sess));

server.use(passport.initialize());
server.use(passport.session());
server.use(express.static(path.join(__dirname, "public")));

server.use(flash());

// Handle auth failure error messages
server.use(function(req, res, next) {
  if (req && req.query && req.query.error) {
    req.flash("error", req.query.error);
  }
  if (req && req.query && req.query.error_description) {
    req.flash("error_description", req.query.error_description);
  }
  next();
});

server.use(userInViews());
server.use("/", authRouter);
server.use("/", indexRouter);
server.use("/", usersRouter);

// Catch 404 and forward to error handler
server.use(function(req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// Error handlers

// Development error handler
// Will print stacktrace
if (server.get("env") === "development") {
  server.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render("error", {
      message: err.message,
      error: err
    });
  });
}

// Production error handler
// No stacktraces leaked to user
server.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render("error", {
    message: err.message,
    error: {}
  });
});

routeConfig(server);
moduleConfig(server);
serveClient(server);

module.exports = { server };
