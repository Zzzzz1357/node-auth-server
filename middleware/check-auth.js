const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "abra_ca_dabra");
    req.userData = { login: decodedToken.login, userId: decodedToken.userId };
    // console.log('Id пользователя: ' + req.userData.userId)
    next();
  } catch (error) {
    res.status(401).json({ message: "Auth failed!" });
  }
};
