const crypto = require("crypto");
const Invite = require("../models/Invite");
const Event = require("../models/Event");

const createInvite = async (req, res) => {
  try {
    const { eventId, recipientEmail } = req.body;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    const invite = await Invite.create({
      event: eventId,
      sender: req.user._id,
      recipientEmail,
      shareToken: crypto.randomBytes(16).toString("hex"),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    res.status(201).json({
      success: true,
      message: "Invitation created successfully",
      invite
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getMyInvites = async (req, res) => {
  try {
    const invites = await Invite.find({
      sender: req.user._id
    }).populate("event");

    res.json({
      success: true,
      invites
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateInviteStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["accepted", "declined"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid invite status"
      });
    }

    const invite = await Invite.findOne({
      shareToken: req.params.token
    });

    if (!invite) {
      return res.status(404).json({
        success: false,
        message: "Invitation not found"
      });
    }

    if (invite.expiresAt && invite.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Invitation expired"
      });
    }

    invite.status = status;
    await invite.save();

    res.json({
      success: true,
      message: "Invitation updated",
      invite
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createInvite,
  getMyInvites,
  updateInviteStatus
};
