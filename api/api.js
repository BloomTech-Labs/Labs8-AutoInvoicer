const api = require("express").Router();
const test = require("./test");
const login = require("./routes/login");
const register = require("./routes/register");
const users = require("./routes/users");
const invoices = require("./routes/invoices");

api.use("/test", test);
api.use("/login", login);
api.use("/register", register);
api.use("/users", users);
api.use("/invoices", invoices);

module.exports = api;
