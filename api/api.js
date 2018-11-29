const api = require("express").Router();

const users = require("./routes/users");
const invoices = require("./routes/invoices");
const charge = require("./routes/charge");

api.use("/users", users);
api.use("/invoices", invoices);
api.use("/charge", charge);

module.exports = api;
