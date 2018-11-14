const routes = require("../api/api");

const express = require("express");
const router = express.Router();
const passport = require("passport");

module.exports = server => {
  server.use("/api", routes);
};
