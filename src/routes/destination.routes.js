const { Router } = require("express");
const destinationController = require("../controllers/destination.controller");
const { protect, restrictTo } = require("../middleware/auth");

const router = Router();

// Public routes
router.get("/", destinationController.getAll);
router.get("/:id", destinationController.getById);

// Admin-only routes
router.use(protect, restrictTo("ADMIN"));
router.post("/", destinationController.create);
router.patch("/:id", destinationController.update);
router.delete("/:id", destinationController.delete);

module.exports = router;
