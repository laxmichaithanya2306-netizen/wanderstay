const jwt = require("jsonwebtoken");
const authMiddleware = (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
        return res.status(401).json({
            msg: "No token, authorization denied"
        });
    }

    // Support both "Bearer <token>" and a raw token
    const token = authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : authHeader;

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({
            msg: "Token is not valid"
        });
    }
};
module.exports = authMiddleware;