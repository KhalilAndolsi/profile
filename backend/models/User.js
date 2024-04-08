const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      minlength: 2,
      maxlength: 50,
      required: true,
    },
    nickname: {
      type: String,
      minlength: 2,
      maxlength: 25,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      minlength: 10,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      minlength: 6,
      required: true,
    },
    bio: {
      type: String,
      maxlength: 300,
      default: "",
    },
    age: {
      type: Number,
      min: 18,
      required: true,
    },
    sex: {
      type: String,
      enum: ["M", "F"],
      default: "M",
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

userSchema.virtual("profileImage").get(function () {
  return this.sex === "M"
    ? "https://api.dicebear.com/7.x/micah/png?seed=kuvi"
    : "https://api.dicebear.com/7.x/micah/png?seed=haha";
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, username: this.username, email: this.email },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "30d" } // Token expiration time
  );
  return token;
};

const User = mongoose.model("User", userSchema);

const registerValidation = (obj) => {
  const schema = Joi.object({
    username: Joi.string().trim().min(2).max(50).required(),
    nickname: Joi.string().trim().min(2).max(25).required(),
    email: Joi.string().trim().min(10).required().email(),
    password: Joi.string().min(6).required(),
    bio: Joi.string().trim().max(300).default(""),
    age: Joi.number().min(18).required(),
    sex: Joi.string().valid("M", "F").default("M"),
  });
  return schema.validate(obj);
};

const loginValidation = (obj) => {
  const schema = Joi.object({
    email: Joi.string().min(10).required().email(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(obj);
};

const updateValidation = (obj) => {
  const schema = Joi.object({
    username: Joi.string().trim().min(2).max(50),
    nickname: Joi.string().trim().min(2).max(25),
    email: Joi.string().trim().min(10).email(),
    bio: Joi.string().trim().max(300).default(""),
    age: Joi.number().min(18),
    sex: Joi.string().valid("M", "F").default("M"),
  });
  return schema.validate(obj);
};

module.exports = {
  User,
  registerValidation,
  loginValidation,
  updateValidation,
};
