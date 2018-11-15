const api = require("express").Router();
const login = require("./routes/login");
const register = require("./routes/register");
const users = require("./routes/users");
const invoices = require("./routes/invoices");
const billing = require("./routes/billing");
const charge = require("./routes/charge");

api.use("/login", login);
api.use("/register", register);
api.use("/users", users);
api.use("/invoices", invoices);
api.use("/billing", billing);
api.use("/charge", charge);

module.exports = api;
