const express = require("express");
const dotenv = require("dotenv");
const connectMongo = require("./config/mongo");
const routeConfig = require("./config/routes");
const moduleConfig = require("./config/modules");
const serveClient = require("./config/serveClient");
const passportConfig = require("./config/passport");

const server = express();

dotenv.load();

moduleConfig(server);
passportConfig(server);
routeConfig(server);
connectMongo();
serveClient(server);

module.exports = server;
