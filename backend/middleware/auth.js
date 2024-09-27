// middleware/auth.js
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token =
    req.header("Authorization") && req.header("Authorization").split(" ")[1];
  if (!token)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });

  try {
    // Decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { id: decoded._id };

    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
  }
};
