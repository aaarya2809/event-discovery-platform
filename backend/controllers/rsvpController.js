const RSVP = require("../models/RSVP");
const Event = require("../models/Event");

const createRSVP = async (req, res) => {
  try {
    const { eventId, status, guests } = req.body;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    const rsvp = await RSVP.findOneAndUpdate(
      {
        user: req.user._id,
        event: eventId
      },
      {
        status: status || "going",
        guests: guests || 0
      },
      {
        new: true,
        upsert: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: "RSVP saved successfully",
      rsvp
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getMyRSVPs = async (req, res) => {
  try {
    const rsvps = await RSVP.find({
      user: req.user._id
    }).populate("event");

    res.json({
      success: true,
      rsvps
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getEventRSVPs = async (req, res) => {
  try {
    const rsvps = await RSVP.find({
      event: req.params.eventId
    }).populate("user", "name email");

    res.json({
      success: true,
      count: rsvps.length,
      rsvps
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const deleteRSVP = async (req, res) => {
  try {
    const rsvp = await RSVP.findOneAndDelete({
      user: req.user._id,
      event: req.params.eventId
    });

    if (!rsvp) {
      return res.status(404).json({
        success: false,
        message: "RSVP not found"
      });
    }

    res.json({
      success: true,
      message: "RSVP cancelled successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createRSVP,
  getMyRSVPs,
  getEventRSVPs,
  deleteRSVP
};
