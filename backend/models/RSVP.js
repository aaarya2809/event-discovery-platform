
const mongoose = require("mongoose");

const rsvpSchema = new mongoose.Schema(
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

    status: {
      type: String,
      enum: ["going", "interested", "cancelled"],
      default: "going"
    },

    guests: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  {
    timestamps: true
  }
);

rsvpSchema.index(
  { user: 1, event: 1 },
  { unique: true }
);

module.exports = mongoose.model("RSVP", rsvpSchema);