const routes = require("../api/api");

module.exports = server => {
  server.use("/api", routes);
};
