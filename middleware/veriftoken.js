const jwt = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"].split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token tidak tersedia" });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (!err) {
      req.user = decoded;
      next();
    } else {
      return res.status(403).json({ message: "Token tidak valid" });
    }
  });
};

module.exports = verifyToken;
