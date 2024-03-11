const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require("./config");

const authmiddleware = function(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({message:"first"});
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        // console.log(decoded);
        if (decoded.userId) {
            req.userId = decoded.userId;
            next();
        } else {
            return res.status(403).json({message:"second"});
        }
    } catch (error) {
        return res.status(403).json({message:"third"});
    }
};

module.exports = {
    authmiddleware
};
