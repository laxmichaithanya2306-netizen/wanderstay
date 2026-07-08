const express = require("express");
const router = express.Router();

const authMiddleware = require("../authMiddleware");
const { register, login } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);

router.get("/protected", authMiddleware, (req, res) => {
    res.json({ msg: "This is a protected route" });
});

module.exports = router;