const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const routeConfig = require("./config/routes");
const moduleConfig = require("./config/modules");
const serveClient = require("./config/serveClient");

// Routes
const users = require("./api/routes/users");

const server = express();

// Body parser middleware
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

// DB Config
const db = require("./config/keys").mongoURI;
// Connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Home test route
server.get("/", (req, res) => res.send("Home"));

// Use routes
server.use("/api/users", users);

moduleConfig(server);
routeConfig(server);
serveClient(server);

module.exports = { server };
