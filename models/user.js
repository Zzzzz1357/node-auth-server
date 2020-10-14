const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  login: { type: String, required: true, unique: true },
  fio: { type: String, required: true, unique: true },
  phone: { type: String, required: false, unique: false},
  password: { type: String, required: true },
  isVerify: { type: Boolean, required: true },
  passUpdate: { type: Boolean, required: true },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Users", userSchema);
