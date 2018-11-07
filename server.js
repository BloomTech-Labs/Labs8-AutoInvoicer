const express = require("express");

const connectMongo = require("./config/mongo")
const routeConfig = require("./config/routes");
const moduleConfig = require("./config/modules");
const serveClient = require("./config/serveClient");

const server = express();

connectMongo(server);
moduleConfig(server);
routeConfig(server);
serveClient(server);

module.exports = { server };
