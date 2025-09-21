const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) throw new Error('No token provided');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = { id: decoded.id, role: decoded.role }; // Simplified; in practice, query DB if needed
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Not authorized', error: err.message });
  }
};

module.exports = auth;