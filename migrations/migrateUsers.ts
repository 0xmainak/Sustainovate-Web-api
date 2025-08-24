/* eslint-disable no-console */
import mongoose from "mongoose";
import { config } from "dotenv";
config();

// Import Event model
import Event from "../src/modules/event/modle"; // adjust path if needed

async function migrateRegistrationDates() {
  try {
    await mongoose.connect(process.env.DATABASE_URL!);

    // Find events with registrationDeadline
    const events = await Event.find({
      $or: [
        { registrationDeadline: { $exists: true } },
        { registrationStart: { $exists: false } },
        { registrationEnd: { $exists: false } },
      ],
    });

    for (const event of events) {
      // Rename registrationDeadline -> registrationEnd
      if (event.registrationDeadline !== undefined) {
        event.registrationEnd = event.registrationDeadline;
        event.registrationDeadline = undefined;
      }

      // Initialize registrationStart if missing
      if (event.registrationStart === undefined) {
        // Example: default to 7 days before startTime
        event.registrationStart = new Date(
          new Date(event.startTime).getTime() - 7 * 24 * 60 * 60 * 1000
        );
      }

      await event.save();
      console.log(`✅ Migrated event: ${event.title}`);
    }

    console.log("🎉 Registration migration completed successfully.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  }
}

migrateRegistrationDates();
