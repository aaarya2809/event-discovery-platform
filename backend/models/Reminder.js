
const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true
    },

    remindAt: {
      type: Date,
      required: true
    },

    channel: {
      type: String,
      enum: ["email", "in-app"],
      default: "in-app"
    },

    isSent: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Reminder", reminderSchema);