const { Router } = require("express");
const authController = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth");

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", protect, authController.getMe);
router.patch("/profile", protect, authController.updateProfile);

module.exports = router;
