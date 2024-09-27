const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
// const { v4: uuidv4 } = require('uuid');
// import { v4 as uuidv4 } from 'uuid'	;

const passwordComplexity = require("joi-password-complexity");
const crypto = require("crypto");
// const secretKey = crypto.randomBytes(32).toString('hex');

const userSchema = new mongoose.Schema({
  // _id:{type:String,required:true,default:uuidv4},
//   _id: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  files: [
    {
      originalName: String,
      path: String,
      code: String,
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
  ],
});

const secretKey = process.env.JWT_SECRET

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id },secretKey, {
    expiresIn: "7d",
  });
  return token;
};

const User = mongoose.model("user", userSchema);

const validate = (data) => {
  const schema = Joi.object({
    // _id: Joi.string().required().label("_id"),
    firstName: Joi.string().required().label("First Name"),
    lastName: Joi.string().required().label("Last Name"),
    email: Joi.string().email().required().label("Email"),
    password: passwordComplexity().required().label("Password"),
  });
  return schema.validate(data);
};

module.exports = { User, validate,secretKey };
