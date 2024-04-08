const mongoose = require("mongoose");

const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  if (mongoose.Types.ObjectId.isValid(id) == false) {
    return res.status(400).json({ error: "Id is not valid!" });
  } else {
    next();
  }
};

module.exports = { validateObjectId };
