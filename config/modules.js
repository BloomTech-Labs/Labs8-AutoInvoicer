const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser");

module.exports = server => {
  server.use(helmet());
  server.use(cors());
  server.use(bodyParser.urlencoded({ extended: false }));
  server.use(bodyParser.json());
};
