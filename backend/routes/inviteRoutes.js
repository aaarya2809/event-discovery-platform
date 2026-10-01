const express = require("express");
const router = express.Router();

const {
  createInvite,
  getMyInvites,
  updateInviteStatus
} = require("../controllers/inviteController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createInvite);
router.get("/my", protect, getMyInvites);
router.put("/:token/status", updateInviteStatus);

module.exports = router;
