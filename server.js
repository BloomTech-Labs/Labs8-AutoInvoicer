const express = require("express");

const routeConfig = require("./config/routes");
const moduleConfig = require("./config/modules");
const serveClient = require("./config/serveClient");

const server = express();

moduleConfig(server);
routeConfig(server);
serveClient(server);

module.exports = { server };
