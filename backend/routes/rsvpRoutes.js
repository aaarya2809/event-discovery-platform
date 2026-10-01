const express = require("express");
const router = express.Router();

const {
  createRSVP,
  getMyRSVPs,
  getEventRSVPs,
  deleteRSVP
} = require("../controllers/rsvpController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createRSVP);
router.get("/my", protect, getMyRSVPs);
router.get("/event/:eventId", protect, getEventRSVPs);
router.delete("/:eventId", protect, deleteRSVP);

module.exports = router;
