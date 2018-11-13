const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema
const UserSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: false
    // change back to true after testing
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  auth0_userID: {
    type: String,
    required: true
  },
  subscribed_member: {
    type: Boolean,
    default: false
  },
  credits: {
    type: Number,
    default: 3
  }
});

const userModel = mongoose.model("users", UserSchema);

// module.exports = User = mongoose.model("users", UserSchema);
module.exports = userModel;
