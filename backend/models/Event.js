
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      default: ""
    },

    category: {
      type: String,
      default: "Other"
    },

    image: {
      type: String,
      default: ""
    },

    venue: {
      type: String,
      default: ""
    },

    city: {
      type: String,
      required: true
    },

    address: {
      type: String,
      default: ""
    },

    date: {
      type: Date,
      required: true
    },

    endDate: {
      type: Date
    },

    price: {
      type: Number,
      default: 0
    },

    currency: {
      type: String,
      default: "INR"
    },

    ticketUrl: {
      type: String,
      default: ""
    },

    source: {
      type: String,
      enum: ["ticketmaster", "manual"],
      default: "manual"
    },

    externalId: {
      type: String,
      default: null
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

eventSchema.index(
  { source: 1, externalId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      externalId: { $type: "string" }
    }
  }
);

eventSchema.index({ city: 1, date: 1 });

module.exports = mongoose.model("Event", eventSchema);