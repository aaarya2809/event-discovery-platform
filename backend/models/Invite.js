
const mongoose = require("mongoose");

const inviteSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    recipientEmail: {
      type: String,
      lowercase: true,
      trim: true
    },

    shareToken: {
      type: String,
      required: true,
      unique: true
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "declined"],
      default: "pending"
    },

    expiresAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Invite", inviteSchema);