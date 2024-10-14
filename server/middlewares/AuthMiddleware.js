const jwt = require("jsonwebtoken");
const verifyToken = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) return res.status(401).send("Access Denied");
  const user = jwt.verify(token, process.env.JWT_KEY);
  req.userId = user.userId;
  next();
};

module.exports = verifyToken;
