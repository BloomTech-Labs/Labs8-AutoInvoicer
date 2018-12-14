const routes = require("../api/api");
const authRouter = require("../api/routes/auth");
const usersRouter = require("../api/routes/users_auth");
const invoicesRouter = require("../api/routes/invoices");

module.exports = server => {
  server.use("/api", routes);
  server.use("/", authRouter);
  server.use("/", usersRouter);
  server.use("/", invoicesRouter);
};
