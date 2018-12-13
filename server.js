const express = require("express");
const dotenv = require("dotenv");
const moduleConfig = require("./config/modules");
const passportConfig = require("./config/passport");
const routeConfig = require("./config/routes");
const connectMongo = require("./config/mongo");
const serveClient = require("./config/serveClient");


const server = express();

dotenv.load();

moduleConfig(server);
passportConfig(server);
routeConfig(server);
connectMongo();
serveClient(server);

module.exports = server;
