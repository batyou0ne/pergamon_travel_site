const { Router } = require("express");
const tripController = require("../controllers/trip.controller");
const { protect } = require("../middleware/auth");

const router = Router();

// All trip routes require authentication
router.use(protect);

router.get("/", tripController.getMyTrips);
router.post("/", tripController.create);
router.get("/:id", tripController.getById);
router.patch("/:id", tripController.update);
router.delete("/:id", tripController.delete);

module.exports = router;
