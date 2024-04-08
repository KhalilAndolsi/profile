const {
  User,
  registerValidation,
  loginValidation,
  updateValidation,
} = require("../models/User");
const bcrypt = require("bcrypt");
const sendMail = require("../utils/sendMail");
const jwt = require("jsonwebtoken");

module.exports.registerCtrl = async (req, res) => {
  try {
    const { error } = registerValidation(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const { email, nickname } = req.body;
    const userEmail = await User.findOne({ email });
    if (userEmail) {
      return res.status(400).json({ error: "This mail already exists!" });
    }
    const nicknameEmail = await User.findOne({ nickname });
    if (nicknameEmail) {
      return res.status(400).json({ error: "This nickname already exists!" });
    }
    const salt = await bcrypt.genSalt(11);
    req.body.password = await bcrypt.hash(req.body.password, salt);
    const profile = await User(req.body);
    await profile.save();
    const token = profile.generateAuthToken();
    const userProfile = await User.findById(profile._id).select("-password");
    await sendMail(email, "Welcom to profile", `<h1>hello ${nickname} 💩</h1>`);
    res.status(200).json({ profile: userProfile, token });
  } catch (err) {
    console.log(err);
    throw new Error("Failed to register!");
  }
};

module.exports.loginCtrl = async (req, res) => {
  try {
    const { authorization } = req.headers;
    if (authorization) {
      if (authorization.startsWith("bearer ") && authorization.split(" ")[1]) {
        try {
          const payload = await jwt.verify(
            authorization.split(" ")[1],
            process.env.JWT_SECRET_KEY
          );
          const profile = await User.findById(payload._id).select("-password");
          return res.status(200).json({
            profile: profile,
            token: authorization.split(" ")[1]
          })
        } catch (err)  {
          console.log(err)
          return res.status(403).json({error: "You are not authorized!"})
        }
      }
    }
    const { error } = loginValidation(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(404)
        .json({ error: "Please enter a correct information!" });
    }
    const passwordValide = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!passwordValide) {
      return res
        .status(404)
        .json({ error: "Please enter a correct information!" });
    }
    const userProfile = await User.findById(user._id).select("-password");
    const token = userProfile.generateAuthToken();
    res.status(200).json({ profile: userProfile, token });
  } catch (err) {
    console.log(err);
    throw new Error("Failed to login!");
  }
};

module.exports.updateCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    if (id !== req.userId) {
      return res
        .status(403)
        .json({ error: "You do not have permission to update this" });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "This user not found!" });
    }
    const { error } = updateValidation(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const userProfileUpdated = await User.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      { new: true }
    ).select("-password");
    res.status(200).json(userProfileUpdated);
  } catch (err) {
    console.log(err);
    throw new Error("Failed to updated!");
  }
};

module.exports.deleteCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    if (id !== req.userId) {
      return res
        .status(403)
        .json({ error: "You do not have permission to update this" });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "This user not found!" });
    }
    await User.findByIdAndDelete(id);
    res.status(200).json({message: "Account deleted successfully"});
  } catch (err) {
    console.log(err);
    throw new Error("Failed to updated!");
  }
};
