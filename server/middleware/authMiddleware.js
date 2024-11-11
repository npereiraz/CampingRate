const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
    const token = req.cookies.token; // Retrieve the token from cookies
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403); // Forbidden
            }
            req.user = user; // Attach user info to req
            next();
        });
    } else {
        res.sendStatus(401); // Unauthorized
    }
};

module.exports = authenticateJWT;