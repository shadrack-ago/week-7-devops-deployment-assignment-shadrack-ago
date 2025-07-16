const jwt = require('jsonwebtoken');
const User = require('../models/User');

const ADMIN_EMAIL = 'admin@example.com';

module.exports = async function (req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user info
    const user = await User.findById(decoded.userId);
    req.user = {
      userId: decoded.userId,
      email: user.email,
      isAdmin: user.email === ADMIN_EMAIL,
    };
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
}; 