const express = require("express");
const mongoose = require("mongoose");

const routeConfig = require("./config/routes");
const moduleConfig = require("./config/modules");
const serveClient = require("./config/serveClient");

const server = express();

// DB Config
const db = require("./config/keys").mongoURI;
// Connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

moduleConfig(server);
routeConfig(server);
serveClient(server);

module.exports = { server };
