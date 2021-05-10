const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.cookies['chat-jwt'];
  console.log(token);
  if (token === '' || !token) {
    res.clearCookie('chat-jwt');
    return res.status(500).json({
        error:"user not logged in"
    })
  }
  let decodeToken;
  try {
    decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (err) {
    return res.status(500).json({
        error:"user not logged in"
    })
  }
  if (!decodeToken) {
    return res.status(500).json({
        error:"user not logged in"
    })
  }
  req.user = decodeToken;
  return next();
};