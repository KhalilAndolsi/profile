const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (authorization && authorization.startsWith("bearer ")) {
      const token = authorization.split(" ")[1];
      if (!token) {
        return res.status(403).json({ error: "Invalid authorization token" });
      }

      const payload = await jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.userId = payload._id;
      next();
    } else {
      return res.status(403).json({ error: "Invalid authorization token" });
    }
  } catch (err) {
    console.error(err);
    return res.status(403).json({ error: "Invalid authorization token" });
  }
};

module.exports = verifyToken;
