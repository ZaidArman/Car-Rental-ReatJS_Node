const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const isAuthenticated = async (req, res, next) => {
    const token  = req.get("Authorization") || req.headers['Authorization']
    if (!token) {
        res.status(409);
        throw new Error("User not logged In");
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodedData.id);
    next();
};

module.exports = {isAuthenticated}