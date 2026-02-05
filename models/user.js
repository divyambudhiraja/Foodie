const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

module.exports = mongoose.model("User", userSchema);


// // models/User.js
// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// // Create Schema
// const UserSchema = new Schema({
//   username: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   password: {
//     type: String,
//     required: true
//   },
//   date: {
//     type: Date,
//     default: Date.now
//   }
// });

// module.exports = User = mongoose.model('users', UserSchema);