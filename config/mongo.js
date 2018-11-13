const mongoose = require("mongoose");

require("dotenv").config();

// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;

// Get the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));

module.exports = server => {
  mongoose
    .connect(
      process.env.MONGO_URI,
      { useNewUrlParser: true }
    )
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));
};
