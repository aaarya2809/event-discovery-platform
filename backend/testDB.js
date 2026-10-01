
require("dotenv").config();

const mongoose = require("mongoose");
const Event = require("./models/Event");

const testDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected!");

    const event = await Event.create({
      title: "Pune Music Festival",
      description: "Live music and entertainment",
      category: "Music",
      city: "Pune",
      venue: "Pune",
      date: new Date("2026-12-15T18:00:00+05:30"),
      price: 499,
      source: "manual"
    });

    console.log("Event created:", event);

    const events = await Event.find();

    console.log("Total events:", events.length);

    await mongoose.disconnect();

    console.log("Database test completed!");

  } catch (error) {
    console.error("Database test failed:", error.message);
    await mongoose.disconnect();
    process.exitCode = 1;
  }
};

testDatabase();