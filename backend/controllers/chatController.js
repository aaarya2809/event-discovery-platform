const Event = require("../models/Event");

const chatWithAssistant = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter a message"
      });
    }

    const events = await Event.find({
      $or: [
        { title: { $regex: message, $options: "i" } },
        { city: { $regex: message, $options: "i" } },
        { category: { $regex: message, $options: "i" } }
      ]
    }).limit(10);

    res.json({
      success: true,
      reply: events.length
        ? `I found ${events.length} matching events for you!`
        : "No matching events found. Try another search.",
      events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { chatWithAssistant };
