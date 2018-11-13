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
    required: false
  },
  lastname: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: true
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

module.exports = userModel;
