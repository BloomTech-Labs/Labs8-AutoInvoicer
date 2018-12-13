const expressjson = require("express").json();
const morgan = require("morgan");
const helmet = require("helmet");
const flash = require("connect-flash");

module.exports = server => {
  server.use(helmet());
  server.use(morgan("combined"));
  server.use(expressjson);
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
};
