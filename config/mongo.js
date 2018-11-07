const mongoose = require("mongoose");

require("dotenv").config();

module.exports = server => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));
};
